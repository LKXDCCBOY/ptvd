const MAX_COMMAND_LENGTH = 2000
const MAX_FILE_SIZE = 500 * 1024 * 1024
const MAX_FILE_NAME_LENGTH = 255
const MAX_OUTPUT_FILE_SIZE = 500 * 1024 * 1024

const DANGEROUS_PATTERNS = [
  /[;&|`$(){}!#<>~]/,
  /\.\.[\\/]/,
  /\\0/,
  /\$\{[^}]+\}/,
  /%[0-9A-Fa-f]{2}/,
]

// 注意：这里只拦截 URL-style 协议前缀（如 concat:foo），
// -f concat（格式标志，后跟 -i filelist.txt）是 concat demuxer，
// 在浏览器中常用于多文件拼接，由上层逻辑自动生成虚拟文件系统内的 filelist.txt，允许通过
const BLOCKED_PROTOCOLS = [
  'http://',
  'https://',
  'ftp://',
  'ftps://',
  'rtmp://',
  'rtmps://',
  'udp://',
  'tcp://',
  'srt://',
  'ristretto://',
  'crypto://',
  'concat:',
  'subfile:',
  'data:',
  'lavfi:',
  'movie:',
]

const PATH_TRAVERSAL_PATTERNS = [
  /\.\.[\\/]/,
  /^[\\/]/,
  /^\//,
  /[\\/]\.\.[\\/]/,
  /\.\.$/,
]

const RESTRICTED_OPTIONS = [
  '-overwrite',
  '-force',
]

const RESOURCE_DRAINING_OPTIONS = [
  '-loop',
  '-loop_input',
  '-loop_output',
]

const NETWORK_RELATED_ARGS = [
  'rtmp',
  'rtmps',
  'udp',
  'tcp',
  'http',
  'https',
  'ftp',
  'ftps',
  'srt',
  'ristretto',
  'crypto',
  'hls',
  'dash',
  'mpegts',
  'applehttp',
  'segment',
  'ssegment',
  'frag',
  'pipe',
  'socket',
]

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateFileName(fileName: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!fileName || fileName.length === 0) {
    errors.push('文件名为空')
    return { valid: false, errors, warnings }
  }

  if (fileName.length > MAX_FILE_NAME_LENGTH) {
    errors.push(`文件名过长（最多 ${MAX_FILE_NAME_LENGTH} 字符）`)
    return { valid: false, errors, warnings }
  }

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(fileName)) {
      errors.push(`文件名包含非法字符: ${fileName}`)
      return { valid: false, errors, warnings }
    }
  }

  if (fileName.startsWith('.') || fileName.startsWith('-')) {
    warnings.push('文件名以点或破折号开头，可能被 FFmpeg 解释为选项')
  }

  const validName = sanitizeFileName(fileName)
  if (validName !== fileName) {
    warnings.push(`文件名已被清理为: ${validName}`)
  }

  return { valid: errors.length === 0, errors, warnings }
}

export function validateFileSize(size: number): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (size <= 0) {
    errors.push('文件大小为零或无效')
  } else if (size > MAX_FILE_SIZE) {
    errors.push(`文件过大（${(size / 1024 / 1024).toFixed(0)}MB），最大允许 ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  } else if (size > 200 * 1024 * 1024) {
    warnings.push('文件较大，处理可能需要较长时间')
  }

  return { valid: errors.length === 0, errors, warnings }
}

export function validateCommand(command: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!command || command.trim().length === 0) {
    errors.push('命令为空')
    return { valid: false, errors, warnings }
  }

  if (command.length > MAX_COMMAND_LENGTH) {
    errors.push(`命令过长（${command.length} 字符），最大允许 ${MAX_COMMAND_LENGTH} 字符`)
    return { valid: false, errors, warnings }
  }

  const lowerCommand = command.toLowerCase()

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(command)) {
      errors.push(`命令包含不允许的特殊字符`)
      return { valid: false, errors, warnings }
    }
  }

  // 协议前缀检测：仅当某个参数以协议前缀开头（例如 concat:file1|file2）才拦截，
  // 允许 -f concat（concat 作为 demuxer 格式名）
  const argsForProtocolCheck = parseCommandArgs(command).map(a => a.toLowerCase())
  for (const protocol of BLOCKED_PROTOCOLS) {
    const hit = argsForProtocolCheck.some(arg => arg.startsWith(protocol))
    if (hit) {
      errors.push(`命令包含被禁止的协议: ${protocol}。出于安全考虑，本工具仅处理本地文件。`)
      return { valid: false, errors, warnings }
    }
  }

  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(command)) {
      errors.push('命令包含路径遍历模式，可能指向系统敏感路径')
      return { valid: false, errors, warnings }
    }
  }

  if (/rm\s+-rf/.test(lowerCommand) || /\bdel\s+\/s/.test(lowerCommand)) {
    errors.push('命令包含危险的删除操作')
    return { valid: false, errors, warnings }
  }

  const args = parseCommandArgs(command)

  for (let i = 0; i < args.length; i++) {
    const arg = args[i].toLowerCase()

    if (RESTRICTED_OPTIONS.includes(arg)) {
      errors.push(`命令包含受限选项: ${arg}。不允许覆盖或强制操作`)
      return { valid: false, errors, warnings }
    }

    if (RESOURCE_DRAINING_OPTIONS.includes(arg)) {
      warnings.push(`命令包含可能导致资源消耗的选项: ${arg}`)
    }

    if (NETWORK_RELATED_ARGS.some(netArg => arg === netArg)) {
      errors.push(`命令包含网络相关参数: ${arg}。本工具禁止网络操作`)
      return { valid: false, errors, warnings }
    }
  }

  if (hasSuspiciousOption(args)) {
    errors.push('命令包含可疑的选项组合')
    return { valid: false, errors, warnings }
  }

  return { valid: errors.length === 0, errors, warnings }
}

function parseCommandArgs(command: string): string[] {
  let cmd = command.trim()
  if (cmd.startsWith('ffmpeg')) {
    cmd = cmd.slice(6).trim()
  }

  if (!cmd) return []

  const args: string[] = []
  let current = ''
  let inQuotes = false
  let quoteChar = ''

  for (let i = 0; i < cmd.length; i++) {
    const char = cmd[i]

    if (inQuotes) {
      if (char === quoteChar && cmd[i - 1] !== '\\') {
        inQuotes = false
      } else if (char !== '\\' || i === cmd.length - 1) {
        current += char
      }
    } else {
      if (char === '"' || char === "'") {
        inQuotes = true
        quoteChar = char
      } else if (char === ' ' || char === '\t') {
        if (current) {
          args.push(current)
          current = ''
        }
      } else {
        current += char
      }
    }
  }

  if (current) {
    args.push(current)
  }

  return args
}

function hasSuspiciousOption(args: string[]): boolean {
  const suspiciousCombos = [
    { pattern: /-i\s+\./, msg: '' },
    { pattern: /\.\.\//, msg: '' },
    { pattern: /\.\.\\/, msg: '' },
  ]

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '-i' && i + 1 < args.length) {
      const nextArg = args[i + 1]
      if (nextArg.startsWith('.') || nextArg.includes('..') || nextArg.startsWith('/')) {
        return true
      }
    }

    if (arg.match(/^[\\/]/) || arg.includes('..')) {
      return true
    }
  }

  return false
}

export function validateOutputFile(fileName: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!fileName || fileName.trim().length === 0) {
    errors.push('输出文件名为空')
    return { valid: false, errors, warnings }
  }

  if (fileName.length > MAX_FILE_NAME_LENGTH) {
    errors.push(`输出文件名过长（最多 ${MAX_FILE_NAME_LENGTH} 字符）`)
    return { valid: false, errors, warnings }
  }

  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(fileName)) {
      errors.push('输出文件名包含路径遍历模式')
      return { valid: false, errors, warnings }
    }
  }

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(fileName)) {
      errors.push('输出文件名包含危险字符')
      return { valid: false, errors, warnings }
    }
  }

  for (const protocol of BLOCKED_PROTOCOLS) {
    if (fileName.toLowerCase().includes(protocol)) {
      errors.push(`输出文件名包含被禁止的协议: ${protocol}`)
      return { valid: false, errors, warnings }
    }
  }

  if (fileName.startsWith('-') || fileName.startsWith('.')) {
    warnings.push('输出文件名以特殊字符开头，可能引起混淆')
  }

  const safeName = sanitizeFileName(fileName)
  if (safeName !== fileName) {
    warnings.push(`输出文件名已被清理为: ${safeName}`)
  }

  return { valid: errors.length === 0, errors, warnings }
}

export function sanitizeFileName(name: string): string {
  let sanitized = name

  sanitized = sanitized.replace(/[\\/:*?"<>|]/g, '_')
  sanitized = sanitized.replace(/\.\./g, '_')
  sanitized = sanitized.replace(/[\x00-\x1F]/g, '')
  sanitized = sanitized.replace(/\$\{[^}]+\}/g, '_')
  sanitized = sanitized.replace(/%[0-9A-Fa-f]{2}/g, '_')
  sanitized = sanitized.replace(/[;&|`$(){}!#<>~]/g, '_')

  while (sanitized.startsWith('.') || sanitized.startsWith('-') || sanitized.startsWith('_')) {
    sanitized = sanitized.substring(1)
  }

  sanitized = sanitized.replace(/_+/g, '_')
  sanitized = sanitized.replace(/^\s+|\s+$/g, '')

  if (sanitized.length > MAX_FILE_NAME_LENGTH) {
    sanitized = sanitized.substring(0, MAX_FILE_NAME_LENGTH)
  }

  return sanitized || 'unnamed_file'
}

export function sanitizeCommand(command: string): string {
  let cmd = command

  cmd = cmd.replace(/[;&|`$(){}!#<>~]/g, '')
  cmd = cmd.replace(/\$\{[^}]+\}/g, '')
  cmd = cmd.replace(/%[0-9A-Fa-f]{2}/g, '')
  cmd = cmd.replace(/[\x00-\x1F]/g, '')

  cmd = cmd.replace(/\s+/g, ' ')
  cmd = cmd.trim()

  return cmd
}

export function sanitizeOutputFileName(name: string): string {
  let sanitized = name

  sanitized = sanitized.replace(/[\\/:*?"<>|]/g, '_')
  sanitized = sanitized.replace(/\.\./g, '_')
  sanitized = sanitized.replace(/[\x00-\x1F]/g, '')
  sanitized = sanitized.replace(/\$\{[^}]+\}/g, '_')
  sanitized = sanitized.replace(/%[0-9A-Fa-f]{2}/g, '_')
  sanitized = sanitized.replace(/[;&|`$(){}!#<>~]/g, '_')

  while (sanitized.startsWith('.') || sanitized.startsWith('-') || sanitized.startsWith('_')) {
    sanitized = sanitized.substring(1)
  }

  sanitized = sanitized.replace(/_+/g, '_')
  sanitized = sanitized.replace(/^\s+|\s+$/g, '')

  if (sanitized.length > MAX_FILE_NAME_LENGTH) {
    sanitized = sanitized.substring(0, MAX_FILE_NAME_LENGTH)
  }

  return sanitized || 'output_file'
}

export function getSecurityConfig() {
  return {
    maxCommandLength: MAX_COMMAND_LENGTH,
    maxFileSize: MAX_FILE_SIZE,
    maxFileNameLength: MAX_FILE_NAME_LENGTH,
    maxOutputFileSize: MAX_OUTPUT_FILE_SIZE,
    blockedProtocols: BLOCKED_PROTOCOLS,
    restrictedOptions: RESTRICTED_OPTIONS,
    resourceDrainingOptions: RESOURCE_DRAINING_OPTIONS,
  }
}
