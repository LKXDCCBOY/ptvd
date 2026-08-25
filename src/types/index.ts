export interface VideoFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  file: File
  status?: 'pending' | 'processing' | 'completed' | 'error'
  progress?: number
  errorMessage?: string
}

export interface OutputFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  blob: Blob
  sourceFile?: string
}

export interface LogEntry {
  id: string
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
  timestamp: number
  fileId?: string
}

export type PresetCategory =
  | 'convert'
  | 'audio'
  | 'compress'
  | 'edit'
  | 'filter'
  | 'extract'
  | 'subtitle'
  | 'watermark'
  | 'stream'
  | 'advanced'
  | 'gif'
  | 'diagnose'

export interface PresetTemplate {
  id: string
  name: string
  description: string
  category: PresetCategory
  command: string
  icon: string
  simplified?: string
  usageHint?: string
  complex?: boolean
  wasmWarning?: boolean
}

export interface HistoryRecord {
  id: string
  command: string
  timestamp: number
  success: boolean
  inputFiles: string[]
  outputFiles: string[]
  batch?: boolean
}

export type FFmpegStatus = 'idle' | 'loading' | 'ready' | 'executing' | 'error'

export interface BatchProgress {
  currentIndex: number
  totalCount: number
  completedCount: number
  failedCount: number
  currentFileName: string
  overallProgress: number
}

export interface BatchResult {
  success: boolean
  inputFile: VideoFile
  outputFiles: OutputFile[]
  error?: string
  duration: number
}
