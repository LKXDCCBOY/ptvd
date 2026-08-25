import React from 'react'
import { History, CheckCircle, XCircle, Clock, Copy, Layers } from 'lucide-react'
import { useFFmpegStore } from '../store/ffmpegStore'
import { useI18n } from '../i18n'

const HistoryPanel: React.FC = () => {
  const { history, setCommand } = useFFmpegStore()
  const { t } = useI18n()

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command)
  }

  const handleUseCommand = (command: string) => {
    setCommand(command)
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-6 text-dark-400">
        <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">{t.history.empty}</p>
        <p className="text-xs opacity-70">{t.history.emptyHint}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <History className="w-4 h-4 text-neon-blue" />
        <span className="text-dark-100 text-sm font-medium">{t.history.title}</span>
        <span className="text-dark-300 text-xs">({history.length})</span>
      </div>

      <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
        {history.map((record) => (
          <div
            key={record.id}
            className={`p-2.5 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-colors group ${
              record.batch ? 'border border-neon-blue/30' : ''
            }`}
          >
            <div className="flex items-start gap-2">
              {record.success ? (
                <CheckCircle className="w-4 h-4 text-neon-green mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-dark-200 text-xs font-mono truncate flex-1">{record.command}</p>
                  {record.batch && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-neon-blue/20 text-neon-blue text-[10px] rounded shrink-0">
                      <Layers className="w-2.5 h-2.5" />
                      {t.history.batch}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-dark-400 text-xs flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(record.timestamp)}
                  </span>
                  <span>{record.inputFiles.length} {t.history.inputs}</span>
                  <span>{record.outputFiles.length} {t.history.outputs}</span>
                </div>
                {record.batch && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {record.inputFiles.slice(0, 3).map((name, idx) => (
                      <span key={idx} className="text-[10px] text-dark-400 bg-dark-600 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                        {name}
                      </span>
                    ))}
                    {record.inputFiles.length > 3 && (
                      <span className="text-[10px] text-dark-400">+{record.inputFiles.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopyCommand(record.command)}
                  className="p-1 rounded hover:bg-dark-600 text-dark-300 hover:text-dark-100"
                  title={t.history.copy}
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleUseCommand(record.command)}
                  className="p-1 rounded hover:bg-dark-600 text-neon-green"
                  title={t.history.use}
                >
                  <History className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryPanel
