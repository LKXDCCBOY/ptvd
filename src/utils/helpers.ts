export function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function replaceInputPlaceholder(command: string, fileName: string): string {
  return command.replace(/\binput\b/g, `"${fileName}"`)
}

export function replaceOutputPlaceholder(command: string, outputName: string): string {
  return command.replace(/\boutput\.mp4\b/g, `"${outputName}"`)
}

export function getOutputExtension(command: string): string {
  const match = command.match(/output\.(\w+)/)
  return match ? `.${match[1]}` : '.mp4'
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.\-]/g, '_')
}

export function parseInputIndices(command: string): number[] {
  const regex = /\binput(\d*)\b/g
  const indices = new Set<number>()
  let match
  while ((match = regex.exec(command)) !== null) {
    const numStr = match[1]
    indices.add(numStr === '' ? 0 : parseInt(numStr, 10))
  }
  return Array.from(indices).sort((a, b) => a - b)
}

export function replaceMultiInputPlaceholders(command: string, safeNames: Record<number, string>): string {
  let result = command
  const indices = Object.keys(safeNames)
    .map(Number)
    .sort((a, b) => b - a)

  for (const idx of indices) {
    if (idx === 0) continue
    const pattern = new RegExp(`\\binput${idx}\\b`, 'g')
    result = result.replace(pattern, `"${safeNames[idx]}"`)
  }

  if (safeNames[0] !== undefined) {
    result = result.replace(/\binput0\b/g, `"${safeNames[0]}"`)
    result = result.replace(/\binput\b/g, `"${safeNames[0]}"`)
  }

  return result
}

export function buildConcatFilelist(safeNames: string[]): string {
  return safeNames.map((name) => `file '${name}'`).join('\n') + '\n'
}

export function isConcatDemuxerCommand(command: string): boolean {
  return /-f\s+concat[\s\S]*?-i\s+["']?[^"'\s]*filelist\.txt/i.test(command)
}

export function isConcatFilterCommand(command: string): boolean {
  return /concat=n=/.test(command)
}

/**
 * 根据当前上传文件数量 n，自动构造 concat filter 的标准输入引用和输出标签。
 * - 带音频：`[0:v][0:a][1:v][1:a]...[n-1:v][n-1:a]concat=n=N:v=1:a=1[outv][outa]`
 *   同时在命令尾部自动加上 `-map "[outv]" -map "[outa]"`
 * - 如果原命令中 `-i` 数量不足 fileCount，自动追加 `-i inputN` 声明
 * - 如果原模板中 filter_complex 的 concat= 前面已有 [xxx][yyy]... 引用前缀，
 *   先把它们替换掉，然后再保证 concat=n=N:v=1:a=1 形式和尾部 -map 存在。
 */
export function regenerateConcatFilterInputs(command: string, fileCount: number): string {
  if (fileCount <= 0) return command

  // 0) 自动追加缺失的 -i inputN 声明
  //    统计命令中已有的 -i input... 占位符数量
  const existingInputs = parseInputIndices(command)
  const maxExistingIdx = existingInputs.length > 0 ? Math.max(...existingInputs) : -1
  const neededExtra: string[] = []
  for (let i = maxExistingIdx + 1; i < fileCount; i++) {
    neededExtra.push(`-i input${i}`)
  }
  let result = command
  if (neededExtra.length > 0) {
    // 在 -filter_complex 之前插入额外的 -i 声明
    const insertPos = result.search(/-filter_complex/i)
    if (insertPos !== -1) {
      result = result.substring(0, insertPos) + neededExtra.join(' ') + ' ' + result.substring(insertPos)
    } else {
      // 找不到 -filter_complex，在最后一个 -i 之后追加
      const lastInputMatch = [...result.matchAll(/-i\s+input\d*/gi)].pop()
      if (lastInputMatch) {
        const afterLast = lastInputMatch.index! + lastInputMatch[0].length
        result = result.substring(0, afterLast) + ' ' + neededExtra.join(' ') + result.substring(afterLast)
      }
    }
  }

  // 1) 生成新的引用前缀 [0:v][0:a][1:v][1:a]...
  const inputPadRefs = []
  for (let i = 0; i < fileCount; i++) {
    inputPadRefs.push(`[${i}:v][${i}:a]`)
  }
  const prefix = inputPadRefs.join('')

  // 2) 找到 concat filter 块并替换
  //    捕获模式：<prefix>?concat=n=N(:v=X)?(:a=X)?(...)<outpad>?
  const oldConcatRegex = /(\[[^\]]+\])*concat=n=\d+(?::v=\d+)?(?::a=\d+)?(\[[^\]]+\])*/i
  if (!oldConcatRegex.test(result)) return result

  // 新的 concat 片段（统一带音频输出）
  const newConcatFragment = `${prefix}concat=n=${fileCount}:v=1:a=1[outv][outa]`

  result = result.replace(oldConcatRegex, newConcatFragment)

  // 3) 确保有 `-map "[outv]" -map "[outa]"`
  //    先把旧的所有 -map "[x:v]"、-map "[x:a]" 去掉（基于标签的映射）
  result = result.replace(/-map\s+"?\[\d+:(?:v|a)\]"?(?=\s|$)/gi, '').trim()

  if (!result.includes('[outv]') && !result.includes('-map')) {
    // 没带任何 -map，追加我们的
    const insertMatch = result.match(/(output\.\w+)/i)
    if (insertMatch) {
      const idx = insertMatch.index!
      const before = result.substring(0, idx)
      const after = result.substring(idx)
      result = `${before}-map "[outv]" -map "[outa]" ${after}`
    }
  } else if (!result.includes('-map "[outv]"')) {
    // 已经有其它 -map，不重复注入
  }

  // 合并多余空格
  result = result.replace(/\s+/g, ' ').trim()

  return result
}
