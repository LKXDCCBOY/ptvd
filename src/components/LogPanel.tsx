import React, { useEffect, useRef } from 'react'
import { Terminal, ChevronDown, Trash2 } from 'lucide-react'
import { useFFmpegStore } from '../store/ffmpegStore'
import { formatTime } from '../utils/helpers'
import { useI18n } from '../i18n'

const LogPanel: React.FC = () => {
  const { logs, clearLogs } = useFFmpegStore()
  const logContainerRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number | null>(null)
  const { t } = useI18n()

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
    if (logs.length > 0 && startTimeRef.current === null) {
      startTimeRef.current = logs[0].timestamp
    }
  }, [logs])

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-neon-green'
      case 'error':
        return 'text-red-400'
      case 'warning':
        return 'text-yellow-400'
      default:
        return 'text-dark-100'
    }
  }

  const getLogPrefix = (type: string) => {
    switch (type) {
      case 'success':
        return t.logs.prefixOk
      case 'error':
        return t.logs.prefixErr
      case 'warning':
        return t.logs.prefixWarn
      default:
        return t.logs.prefixInfo
    }
  }

  const getLogBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-neon-green/5 border-l-2 border-neon-green'
      case 'error':
        return 'bg-red-500/5 border-l-2 border-red-400'
      case 'warning':
        return 'bg-yellow-500/5 border-l-2 border-yellow-400'
      default:
        return 'border-l-2 border-transparent'
    }
  }

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 bg-dark-700 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-neon-green" />
          <span className="text-dark-100 text-sm font-medium">{t.logs.title}</span>
          <span className="text-dark-300 text-xs">({logs.length})</span>
        </div>
        <button
          onClick={clearLogs}
          className="flex items-center gap-1 px-2 py-1 rounded text-dark-300 hover:text-red-400 hover:bg-dark-600 transition-colors text-xs"
        >
          <Trash2 className="w-3 h-3" />
          <span>{t.logs.clear}</span>
        </button>
      </div>

      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-1 max-h-[300px] min-h-[200px] font-mono text-xs"
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-dark-400 gap-2">
            <Terminal className="w-8 h-8 opacity-30" />
            <p>{t.logs.empty}</p>
            <p className="text-xs opacity-70">{t.logs.emptyHint}</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={log.id}
              className={`px-2 py-1 rounded ${getLogBg(log.type)} animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-dark-400 mr-2">
                {formatTime((log.timestamp - (startTimeRef.current || log.timestamp)) / 1000)}
              </span>
              <span className={`${getLogColor(log.type)} font-semibold mr-2`}>
                {getLogPrefix(log.type)}
              </span>
              <span className={getLogColor(log.type)}>{log.message}</span>
            </div>
          ))
        )}
      </div>

      {logs.length > 0 && (
        <div className="px-4 py-2 bg-dark-700/50 border-t border-dark-500">
          <button
            onClick={() => {
              if (logContainerRef.current) {
                logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
              }
            }}
            className="flex items-center gap-1 text-dark-300 hover:text-dark-100 text-xs transition-colors"
          >
            <ChevronDown className="w-3 h-3" />
            <span>{t.logs.scrollBottom}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default LogPanel
