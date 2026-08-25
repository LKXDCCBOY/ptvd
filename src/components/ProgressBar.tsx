import React from 'react'
import { Loader2, FileText } from 'lucide-react'
import { useFFmpegStore } from '../store/ffmpegStore'
import { useI18n } from '../i18n'

const ProgressBar: React.FC = () => {
  const { progress, isExecuting, status, batchProgress, isBatchMode, files } = useFFmpegStore()
  const { t } = useI18n()

  const getStatusText = () => {
    if (isBatchMode && batchProgress && isExecuting) {
      return `${t.status.processingFile}: ${batchProgress.currentFileName}`
    }
    switch (status) {
      case 'idle':
        return t.status.idle
      case 'loading':
        return t.status.loading
      case 'ready':
        return t.status.ready
      case 'executing':
        return isExecuting ? t.status.executing : t.status.ready
      case 'error':
        return t.status.error
      default:
        return t.status.ready
    }
  }

  const getProgressColor = () => {
    if (!isExecuting) return 'bg-dark-500'
    return progress > 0 ? 'bg-neon-green' : 'bg-dark-500'
  }

  const completedCount = files.filter(f => f.status === 'completed').length
  const failedCount = files.filter(f => f.status === 'error').length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isExecuting ? (
            <Loader2 className="w-4 h-4 text-neon-green animate-spin" />
          ) : (
            <div className={`w-2 h-2 rounded-full ${
              status === 'error' ? 'bg-red-400' :
              status === 'ready' ? 'bg-neon-green' :
              status === 'loading' ? 'bg-yellow-400' : 'bg-dark-400'
            }`} />
          )}
          <span className="text-dark-200 text-sm truncate max-w-[200px]">{getStatusText()}</span>
        </div>
        <span className="text-dark-300 text-sm font-mono">
          {isExecuting ? `${Math.round(progress)}%` : '--'}
        </span>
      </div>

      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-out ${getProgressColor()} ${
            isExecuting ? 'animate-pulse' : ''
          }`}
          style={{ width: `${isExecuting ? Math.max(progress, 2) : 0}%` }}
        />
      </div>

      {isBatchMode && batchProgress && (
        <div className="space-y-2 p-2 bg-dark-700/50 rounded-lg">
          <div className="flex items-center justify-between text-xs text-dark-300">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {t.editor.batchProgress}
            </span>
            <span>
              {batchProgress.completedCount + batchProgress.failedCount} / {batchProgress.totalCount}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-neon-green" />
              <span className="text-dark-300">{t.uploader.completed}: {completedCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-dark-300">{t.uploader.failed}: {failedCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-dark-400" />
              <span className="text-dark-300">
                {t.uploader.pending}: {batchProgress.totalCount - completedCount - failedCount}
              </span>
            </div>
          </div>

          {isExecuting && batchProgress.currentFileName && (
            <p className="text-xs text-dark-400 truncate">
              {t.editor.currentFile}: {batchProgress.currentFileName}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default ProgressBar
