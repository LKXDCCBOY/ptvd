import { create } from 'zustand'
import { VideoFile, OutputFile, LogEntry, HistoryRecord, FFmpegStatus, BatchProgress, PresetTemplate } from '../types'
import {
  generateId,
  parseInputIndices,
  replaceMultiInputPlaceholders,
  buildConcatFilelist,
  isConcatDemuxerCommand,
  isConcatFilterCommand,
  regenerateConcatFilterInputs,
  sanitizeFileName as sanitizeFileNameHelper,
} from '../utils/helpers'
import { validateCommand, validateFileName, validateFileSize, sanitizeFileName } from '../utils/security'
import { ffmpegService } from '../services/ffmpegService'

interface FFmpegStore {
  status: FFmpegStatus
  files: VideoFile[]
  outputs: OutputFile[]
  logs: LogEntry[]
  command: string
  progress: number
  isExecuting: boolean
  isBatchMode: boolean
  batchProgress: BatchProgress | null
  history: HistoryRecord[]
  error: string | null
  loadStatus: string
  fastMode: boolean
  selectedPreset: PresetTemplate | null

  setStatus: (status: FFmpegStatus) => void
  setFastMode: (mode: boolean) => void
  setSelectedPreset: (preset: PresetTemplate | null) => void
  addFile: (file: VideoFile) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  updateFileStatus: (id: string, status: VideoFile['status'], progress?: number, errorMessage?: string) => void
  addOutput: (output: OutputFile) => void
  removeOutput: (id: string) => void
  addLog: (log: LogEntry) => void
  clearLogs: () => void
  setCommand: (command: string) => void
  setProgress: (progress: number) => void
  setIsExecuting: (isExecuting: boolean) => void
  setBatchMode: (mode: boolean) => void
  setBatchProgress: (progress: BatchProgress | null) => void
  addHistory: (record: HistoryRecord) => void
  setError: (error: string | null) => void
  initFFmpeg: () => Promise<void>
  executeCommand: () => Promise<void>
  executeBatch: () => Promise<void>
  processSingleFile: (file: VideoFile, commandTemplate: string) => Promise<{ outputs: OutputFile[]; success: boolean; error?: string }>
  reset: () => void
}

const loadHistory = (): HistoryRecord[] => {
  try {
    const saved = localStorage.getItem('ffmpeg-history')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveHistory = (history: HistoryRecord[]) => {
  try {
    localStorage.setItem('ffmpeg-history', JSON.stringify(history))
  } catch {
    // 忽略存储错误
  }
}

const FFmpeg_INIT_FLAG = 'ffmpeg-init-success'
const FFmpeg_INIT_VERSION = 'v1'

const hasInitializedBefore = (): boolean => {
  try {
    const flag = localStorage.getItem(FFmpeg_INIT_FLAG)
    return flag === FFmpeg_INIT_VERSION
  } catch {
    return false
  }
}

const markInitialized = () => {
  try {
    localStorage.setItem(FFmpeg_INIT_FLAG, FFmpeg_INIT_VERSION)
  } catch {
    // 忽略存储错误
  }
}

export const clearInitFlag = () => {
  try {
    localStorage.removeItem(FFmpeg_INIT_FLAG)
  } catch {
    // 忽略存储错误
  }
}

export const useFFmpegStore = create<FFmpegStore>((set, get) => ({
  status: 'idle',
  files: [],
  outputs: [],
  logs: [],
  command: 'ffmpeg -i input -c:v libx264 -c:a aac output.mp4',
  progress: 0,
  isExecuting: false,
  isBatchMode: false,
  batchProgress: null,
  history: loadHistory(),
  error: null,
  loadStatus: '',
  fastMode: true,
  selectedPreset: null,

  setStatus: (status) => set({ status }),
  setFastMode: (mode) => set({ fastMode: mode }),
  setSelectedPreset: (preset) => set({ selectedPreset: preset }),
  
  addFile: (file) => set((state) => ({ files: [...state.files, { ...file, status: 'pending', progress: 0 }] })),
  
  removeFile: (id) => set((state) => {
    const file = state.files.find((f) => f.id === id)
    if (file) {
      URL.revokeObjectURL(file.url)
    }
    return { files: state.files.filter((f) => f.id !== id) }
  }),

  clearFiles: () => set((state) => {
    state.files.forEach((f) => URL.revokeObjectURL(f.url))
    return { files: [] }
  }),

  updateFileStatus: (id, status, progress, errorMessage) => set((state) => ({
    files: state.files.map((f) => 
      f.id === id 
        ? { ...f, status, progress: progress ?? f.progress, errorMessage }
        : f
    )
  })),
  
  addOutput: (output) => set((state) => ({ outputs: [...state.outputs, output] })),
  
  removeOutput: (id) => set((state) => {
    const output = state.outputs.find((o) => o.id === id)
    if (output) {
      URL.revokeObjectURL(output.url)
    }
    return { outputs: state.outputs.filter((o) => o.id !== id) }
  }),
  
  addLog: (log) => set((state) => ({ logs: [...state.logs, log].slice(-500) })),
  
  clearLogs: () => set({ logs: [] }),
  
  setCommand: (command) => set({ command }),
  
  setProgress: (progress) => set({ progress }),
  
  setIsExecuting: (isExecuting) => set({ isExecuting }),

  setBatchMode: (mode) => set({ isBatchMode: mode }),

  setBatchProgress: (progress) => set({ batchProgress: progress }),
  
  addHistory: (record) => set((state) => {
    const newHistory = [record, ...state.history].slice(0, 50)
    saveHistory(newHistory)
    return { history: newHistory }
  }),
  
  setError: (error) => set({ error }),

  initFFmpeg: async () => {
    console.log('[Store] initFFmpeg called')
    const state = get()
    if (state.status === 'loading' || state.status === 'ready') {
      console.log('[Store] Already loading or ready, skipping')
      return
    }

    set({ status: 'loading', progress: 0, error: null, loadStatus: '准备中...' })
    
    try {
      ffmpegService.setLogCallback((message) => {
        console.log('[FFmpeg log]', message)
        get().addLog({
          id: generateId(),
          type: 'info',
          message,
          timestamp: Date.now(),
        })
      })

      ffmpegService.setProgressCallback((progress) => {
        console.log('[FFmpeg progress]', progress)
        if (progress > 0) {
          // 限制进度在 0-100 范围内
          const clampedProgress = Math.min(progress * 100, 99)
          set({ progress: clampedProgress })
        }
      })

      ffmpegService.setStatusCallback((status) => {
        console.log('[FFmpeg status]', status)
        set({ loadStatus: status })
      })

      console.log('[Store] Calling ffmpegService.init()...')
      await ffmpegService.init()
      console.log('[Store] ffmpegService.init() succeeded')
      
      markInitialized()
      set({ progress: 100, error: null, loadStatus: '就绪', status: 'ready' })
    } catch (error: any) {
      console.error('[Store] initFFmpeg failed:', error)
      set({ 
        status: 'error', 
        progress: 0,
        error: error.message || '初始化失败',
        loadStatus: ''
      })
    }
  },

  executeCommand: async () => {
    const state = get()
    if (state.isExecuting) return
    if (state.files.length === 0) {
      get().addLog({
        id: generateId(),
        type: 'warning',
        message: '请先上传视频文件',
        timestamp: Date.now(),
      })
      return
    }

    if (state.status !== 'ready') {
      await get().initFFmpeg()
    }

    let template = state.command

    // ---------- 1. 探测命令模式 ----------
    const isConcatDemuxer = isConcatDemuxerCommand(template)
    const isConcatFilter = isConcatFilterCommand(template)
    const usedIndices = parseInputIndices(template)
    const maxInputIndex = usedIndices.length > 0 ? Math.max(...usedIndices) : 0

    // concat demuxer 或 concat filter 时，自动把所有上传的文件视为输入
    const useAllUploadedFiles = isConcatDemuxer || isConcatFilter
    const requiredFileCount = useAllUploadedFiles
      ? state.files.length
      : Math.max(maxInputIndex + 1, 1)

    if (state.files.length < requiredFileCount && !useAllUploadedFiles) {
      get().addLog({
        id: generateId(),
        type: 'warning',
        message: `命令需要至少 ${requiredFileCount} 个文件，但仅上传了 ${state.files.length} 个。请上传更多文件（input0/input1...）。`,
        timestamp: Date.now(),
      })
      return
    }

    // ---------- 2. 为每个上传文件生成安全内部名 ----------
    // 规范：中文/空格/括号 全部去掉，文件名形如 input_000.mp4、input_001.mp3
    const writtenNames: string[] = []
    const safeNamesMap: Record<number, string> = {}
    const concatSafeNames: string[] = []

    for (let i = 0; i < state.files.length; i++) {
      const file = state.files[i]

      const sizeValid = validateFileSize(file.size)
      if (!sizeValid.valid) {
        sizeValid.errors.forEach((err) => {
          get().addLog({
            id: generateId(),
            type: 'error',
            message: `[文件 ${i + 1}] ${err}`,
            timestamp: Date.now(),
          })
        })
        return
      }

      const ext = file.name.split('.').pop() || 'mp4'
      const safeName = `input_${String(i).padStart(3, '0')}.${ext}`
      safeNamesMap[i] = safeName
      writtenNames.push(safeName)
      concatSafeNames.push(safeName)
    }

    // ---------- 3. 如果是 concat demuxer，自动改写命令为可用形态 ----------
    //    原：-f concat -safe 0 -i filelist.txt -c copy output.mp4
    //    改写占位逻辑保持不变，filelist.txt 由我们写入
    if (isConcatDemuxer) {
      // 告知用户
      get().addLog({
        id: generateId(),
        type: 'info',
        message: `检测到拼接（concat demuxer）模式，将按上传顺序拼接 ${state.files.length} 个文件（自动生成 filelist.txt）`,
        timestamp: Date.now(),
      })
    } else if (isConcatFilter) {
      // 如果是 concat filter + 用户在 concat=n= 上写死了数值，我们自动根据上传数改写
      const uploadCount = state.files.length
      template = template.replace(/concat=n=\d+/, `concat=n=${uploadCount}`)
      // 同样要检查 v=a= 参数是否需要改写
      get().addLog({
        id: generateId(),
        type: 'info',
        message: `检测到拼接（concat filter）模式，将使用 concat=n=${uploadCount} 滤镜拼接 ${uploadCount} 个文件`,
        timestamp: Date.now(),
      })
      // 自动补充 [0:v][0:a][1:v][1:a]... 前缀，如果 filter_complex 里 concat 前面没引用的话
      // 策略：如果 concat= 前是 `[v][a]...` 这种长度与文件数不匹配，重新生成标准引用
      template = regenerateConcatFilterInputs(template, uploadCount)
    }

    // ---------- 4. 替换 input/input0/input1... 占位符 ----------
    let command = replaceMultiInputPlaceholders(template, safeNamesMap)

    // ---------- 5. fastMode 注入 ----------
    if (state.fastMode && !command.includes('-preset')) {
      command = command.replace(/-c:v libx264/, '-c:v libx264 -preset ultrafast')
    }

    // ---------- 6. 验证命令 ----------
    const commandValidation = validateCommand(command)
    if (!commandValidation.valid) {
      commandValidation.errors.forEach((err) => {
        get().addLog({
          id: generateId(),
          type: 'error',
          message: `命令验证失败: ${err}`,
          timestamp: Date.now(),
        })
      })
      return
    }

    commandValidation.warnings.forEach((warn) => {
      get().addLog({
        id: generateId(),
        type: 'warning',
        message: warn,
        timestamp: Date.now(),
      })
    })

    if (command.includes('libvpx') || command.includes('libtheora')) {
      get().addLog({
        id: generateId(),
        type: 'warning',
        message: '⚠ 警告：VP8/VP9/Theora 编码器在浏览器 WASM 中可能不稳定，建议使用 H.264 (libx264) 编码器',
        timestamp: Date.now(),
      })
    }

    set({ isExecuting: true, progress: 0, error: null, loadStatus: '处理中...' })
    get().addLog({
      id: generateId(),
      type: 'info',
      message: `开始执行命令: ${command}`,
      timestamp: Date.now(),
    })

    const startTime = Date.now()
    let filelistWritten = false

    try {
      // ---------- 7. 写入所有输入文件 + 必要时生成 filelist.txt ----------
      for (let i = 0; i < state.files.length; i++) {
        const file = state.files[i]
        const safeName = writtenNames[i]
        get().addLog({
          id: generateId(),
          type: 'info',
          message: `写入输入文件 [${i + 1}/${state.files.length}]: ${file.name} → ${safeName} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
          timestamp: Date.now(),
        })
        await ffmpegService.writeFile(safeName, file.file)
      }

      if (isConcatDemuxer) {
        const filelistContent = buildConcatFilelist(concatSafeNames)
        await ffmpegService.writeTextFile('filelist.txt', filelistContent)
        filelistWritten = true
        get().addLog({
          id: generateId(),
          type: 'info',
          message: `已生成拼接清单 filelist.txt:\n${filelistContent}`,
          timestamp: Date.now(),
        })
      }

      // ---------- 8. 执行 ----------
      const result = await ffmpegService.execute(command, (progress) => {
        set({ progress: progress * 100, loadStatus: `处理中 ${Math.round(progress * 100)}%` })
      })

      for (const output of result.blobs) {
        const url = URL.createObjectURL(output.blob)

        get().addOutput({
          id: generateId(),
          name: output.name,
          size: output.blob.size,
          type: output.blob.type || 'application/octet-stream',
          url,
          blob: output.blob,
        })

        get().addLog({
          id: generateId(),
          type: 'success',
          message: `生成输出文件: ${output.name} (${(output.blob.size / 1024 / 1024).toFixed(2)} MB)`,
          timestamp: Date.now(),
        })
      }

      get().addLog({
        id: generateId(),
        type: 'success',
        message: `执行完成！耗时 ${((Date.now() - startTime) / 1000).toFixed(1)} 秒`,
        timestamp: Date.now(),
      })

      get().addHistory({
        id: generateId(),
        command: state.command,
        timestamp: Date.now(),
        success: true,
        inputFiles: state.files.map((f) => f.name),
        outputFiles: result.blobs.map((b) => b.name),
      })
    } catch (error: any) {
      set({ error: error.message || '执行失败' })
      get().addLog({
        id: generateId(),
        type: 'error',
        message: `执行失败: ${error.message || error}`,
        timestamp: Date.now(),
      })

      get().addHistory({
        id: generateId(),
        command: state.command,
        timestamp: Date.now(),
        success: false,
        inputFiles: state.files.map((f) => f.name),
        outputFiles: [],
      })
    } finally {
      set({ isExecuting: false, progress: 0 })
      // 清理输入文件
      for (const name of writtenNames) {
        try { await ffmpegService.deleteFile(name) } catch {}
      }
      if (filelistWritten) {
        try { await ffmpegService.deleteFile('filelist.txt') } catch {}
      }
    }
  },

  processSingleFile: async (file, commandTemplate) => {
    const state = get()
    const outputResults: OutputFile[] = []
    const ext = file.name.split('.').pop() || 'mp4'
    const safeInputName = `batch_file_${Date.now()}.${ext}`
    let command = commandTemplate.replace(/\binput\b/g, `"${safeInputName}"`)

    if (state.fastMode && !command.includes('-preset')) {
      command = command.replace(/-c:v libx264/, '-c:v libx264 -preset ultrafast')
    }

    const startTime = Date.now()

    try {
      get().updateFileStatus(file.id, 'processing', 0)

      await ffmpegService.writeFile(safeInputName, file.file)

      const commandValidation = validateCommand(command)
      if (!commandValidation.valid) {
        throw new Error(commandValidation.errors.join('; '))
      }

      const result = await ffmpegService.execute(command, (progress) => {
        get().updateFileStatus(file.id, 'processing', progress)
      })

      for (const blob of result.blobs) {
        const url = URL.createObjectURL(blob.blob)

        const outputFile: OutputFile = {
          id: generateId(),
          name: blob.name,
          size: blob.blob.size,
          type: blob.blob.type || 'application/octet-stream',
          url,
          blob: blob.blob,
          sourceFile: file.name,
        }

        outputResults.push(outputFile)
        get().addOutput(outputFile)

        get().addLog({
          id: generateId(),
          type: 'success',
          message: `生成输出: ${blob.name} (${(blob.blob.size / 1024 / 1024).toFixed(2)} MB)`,
          timestamp: Date.now(),
          fileId: file.id,
        })
      }

      get().updateFileStatus(file.id, 'completed', 100)
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1)
      get().addLog({
        id: generateId(),
        type: 'success',
        message: `文件处理完成: ${file.name} (耗时 ${duration}s)`,
        timestamp: Date.now(),
        fileId: file.id,
      })

      return { outputs: outputResults, success: true }
    } catch (error: any) {
      get().updateFileStatus(file.id, 'error', 0, error.message)
      
      get().addLog({
        id: generateId(),
        type: 'error',
        message: `文件处理失败: ${file.name} - ${error.message || error}`,
        timestamp: Date.now(),
        fileId: file.id,
      })

      return { outputs: outputResults, success: false, error: error.message }
    } finally {
      await ffmpegService.deleteFile(safeInputName)
    }
  },

  executeBatch: async () => {
    const state = get()
    if (state.isExecuting) return
    if (state.files.length === 0) {
      get().addLog({
        id: generateId(),
        type: 'warning',
        message: '请先上传文件',
        timestamp: Date.now(),
      })
      return
    }

    const files = state.files
    
    for (const file of files) {
      const fileSizeValidation = validateFileSize(file.size)
      if (!fileSizeValidation.valid) {
        get().updateFileStatus(file.id, 'error', 0, fileSizeValidation.errors[0])
        continue
      }
    }

    if (state.status !== 'ready') {
      await get().initFFmpeg()
    }

    set({ isExecuting: true, progress: 0, error: null, isBatchMode: true })
    
    get().addLog({
      id: generateId(),
      type: 'info',
      message: `开始批量处理 ${files.length} 个文件...`,
      timestamp: Date.now(),
    })

    const batchStartTime = Date.now()
    let completedCount = 0
    let failedCount = 0
    const allOutputFiles: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      get().setBatchProgress({
        currentIndex: i,
        totalCount: files.length,
        completedCount,
        failedCount,
        currentFileName: file.name,
        overallProgress: (i / files.length) * 100,
      })

      get().addLog({
        id: generateId(),
        type: 'info',
        message: `[${i + 1}/${files.length}] 正在处理: ${file.name}`,
        timestamp: Date.now(),
      })

      const result = await get().processSingleFile(file, state.command)

      if (result.success) {
        completedCount++
        result.outputs.forEach(o => allOutputFiles.push(o.name))
      } else {
        failedCount++
      }

      const overallProgress = ((completedCount + failedCount) / files.length) * 100
      set({ progress: overallProgress })

      get().setBatchProgress({
        currentIndex: i + 1,
        totalCount: files.length,
        completedCount,
        failedCount,
        currentFileName: i + 1 < files.length ? files[i + 1].name : '',
        overallProgress,
      })
    }

    const batchDuration = ((Date.now() - batchStartTime) / 1000).toFixed(1)
    
    if (failedCount > 0) {
      get().addLog({
        id: generateId(),
        type: 'warning',
        message: `批量处理完成（部分失败）。成功: ${completedCount}, 失败: ${failedCount}，总耗时 ${batchDuration}s`,
        timestamp: Date.now(),
      })
    } else {
      get().addLog({
        id: generateId(),
        type: 'success',
        message: `批量处理完成！全部 ${completedCount} 个文件成功处理，总耗时 ${batchDuration}s`,
        timestamp: Date.now(),
      })
    }

    get().addHistory({
      id: generateId(),
      command: state.command,
      timestamp: Date.now(),
      success: failedCount === 0,
      inputFiles: files.map((f) => f.name),
      outputFiles: allOutputFiles,
      batch: true,
    })

    set({ isExecuting: false, progress: 0 })
    get().setBatchProgress(null)
  },

  reset: () => {
    const state = get()
    state.outputs.forEach((o) => URL.revokeObjectURL(o.url))
    state.files.forEach((f) => URL.revokeObjectURL(f.url))
    set({
      files: [],
      outputs: [],
      logs: [],
      progress: 0,
      error: null,
      isBatchMode: false,
      batchProgress: null,
    })
  },
}))
