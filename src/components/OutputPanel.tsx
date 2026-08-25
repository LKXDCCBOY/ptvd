import React from 'react'
import { Download, FileVideo, FileAudio, FileImage, X } from 'lucide-react'
import { useFFmpegStore } from '../store/ffmpegStore'
import { formatFileSize } from '../utils/helpers'
import { useI18n } from '../i18n'

const OutputPanel: React.FC = () => {
  const { outputs, removeOutput } = useFFmpegStore()
  const { t } = useI18n()

  const getFileIcon = (type: string) => {
    if (type.startsWith('video/')) return <FileVideo className="w-5 h-5 text-neon-blue" />
    if (type.startsWith('audio/')) return <FileAudio className="w-5 h-5 text-neon-green" />
    if (type.startsWith('image/')) return <FileImage className="w-5 h-5 text-yellow-400" />
    return <FileVideo className="w-5 h-5 text-purple-400" />
  }

  const handleDownload = (output: typeof outputs[0]) => {
    const a = document.createElement('a')
    a.href = output.url
    a.download = output.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden flex flex-col">
      <div className="px-4 py-3 bg-dark-700 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <span className="text-dark-100 text-sm font-medium">{t.output.title}</span>
          <span className="text-dark-300 text-xs">({outputs.length})</span>
        </div>
      </div>

      <div className="p-3 space-y-2 min-h-[150px] max-h-[250px] overflow-y-auto">
        {outputs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-dark-400 gap-2 py-8">
            <FileVideo className="w-8 h-8 opacity-30" />
            <p className="text-sm">{t.output.empty}</p>
            <p className="text-xs opacity-70">{t.output.emptyHint}</p>
          </div>
        ) : (
          outputs.map((output) => (
            <div
              key={output.id}
              className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg group hover:bg-dark-600 transition-all animate-slide-up"
            >
              {getFileIcon(output.type)}
              <div className="flex-1 min-w-0">
                <p className="text-dark-100 text-sm truncate">{output.name}</p>
                <p className="text-dark-300 text-xs">{formatFileSize(output.size)}</p>
                {output.sourceFile && (
                  <p className="text-dark-400 text-xs mt-0.5 truncate">
                    {t.output.sourceFile}: {output.sourceFile}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDownload(output)}
                  className="p-2 rounded-lg bg-neon-green/10 hover:bg-neon-green/20 text-neon-green transition-colors"
                  title={t.output.download}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeOutput(output.id)}
                  className="p-2 rounded-lg bg-dark-600 hover:bg-red-500/20 text-dark-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title={t.output.remove}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default OutputPanel
