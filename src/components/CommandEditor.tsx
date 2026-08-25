import React, { useEffect, useRef, useMemo } from 'react'
import { Terminal, Play, Square, RotateCcw, Layers, FileVideo, Zap, Info, Lock, Pencil, ChevronDown, ChevronRight, AlertTriangle, Wand2, Lightbulb } from 'lucide-react'
import { useFFmpegStore } from '../store/ffmpegStore'
import { useI18n } from '../i18n'
import { parseCommandSegments, CommandSegment } from '../utils/commandSegments'

const CommandEditor: React.FC = () => {
  const { command, setCommand, isExecuting, executeCommand, executeBatch, status, initFFmpeg, files, isBatchMode, setBatchMode, fastMode, setFastMode, selectedPreset } = useFFmpegStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { t, language } = useI18n()

  const [useSimplified, setUseSimplified] = React.useState(false)

  useEffect(() => {
    setUseSimplified(false)
  }, [selectedPreset?.id])

  const activeCommand = useMemo(() => {
    if (!selectedPreset) return ''
    return (useSimplified && selectedPreset.simplified) ? selectedPreset.simplified : selectedPreset.command
  }, [selectedPreset, useSimplified])

  const segments = useMemo(() => {
    if (!selectedPreset) return []
    return parseCommandSegments(activeCommand, language)
  }, [selectedPreset, activeCommand, language])

  const [expandedSegments, setExpandedSegments] = React.useState(true)

  useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 120)}px`
  }, [command])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd
      const newCommand = command.substring(0, start) + '  ' + command.substring(end)
      setCommand(newCommand)
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2
      })
    }
  }

  const handleExecute = async () => {
    if (status !== 'ready') {
      await initFFmpeg()
    }
    if (files.length === 1) {
      await executeCommand()
    } else {
      await executeBatch()
    }
  }

  const handleReset = () => {
    setCommand('ffmpeg -i input -c:v libx264 -c:a aac output.mp4')
  }

  const toggleBatchMode = () => {
    setBatchMode(!isBatchMode)
  }

  const toggleSegments = () => {
    setExpandedSegments(!expandedSegments)
  }

  const canExecute = !isExecuting && files.length > 0 && command.trim().length > 0
  const hasMultipleFiles = files.length > 1

  const getSegmentIcon = (segment: CommandSegment) => {
    if (segment.type === 'input') return <Pencil className="w-3 h-3 text-yellow-400" />
    if (segment.type === 'output') return <Pencil className="w-3 h-3 text-yellow-400" />
    if (segment.editable) return <Pencil className="w-3 h-3 text-yellow-400" />
    return <Lock className="w-3 h-3 text-dark-400" />
  }

  const getSegmentBg = (segment: CommandSegment) => {
    if (segment.editable) return 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20'
    return 'bg-neon-green/10 text-neon-green border-neon-green/20'
  }

  const isEditableSegment = (segment: CommandSegment) => {
    return segment.editable && segment.type !== 'separator'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="w-5 h-5 text-neon-green" />
        <h3 className="text-dark-100 font-medium">{t.editor.title}</h3>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-dark-800 rounded-l-lg flex flex-col items-center pt-3 text-dark-300 text-xs font-mono select-none pointer-events-none">
          {command.split('\n').map((_, i) => (
            <span key={i} className="leading-6">
              {i + 1}
            </span>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-dark-800 border border-dark-500 rounded-lg py-3 pl-12 pr-4 font-mono text-sm text-neon-green resize-none focus:outline-none focus:border-neon-green focus:shadow-neon transition-all min-h-[120px]"
          spellCheck={false}
          placeholder="ffmpeg -i input -c:v libx264 output.mp4"
          disabled={isExecuting}
        />
      </div>

      {selectedPreset?.complex && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <Wand2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-amber-300 font-medium">{t.editor.complexLabel}</span>
        </div>
      )}

      {selectedPreset?.wasmWarning && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <span className="text-xs text-red-300 leading-relaxed">
            {t.editor.wasmWarningText}
          </span>
        </div>
      )}

      {selectedPreset?.usageHint && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <Lightbulb className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
          <span className="text-xs text-blue-300 leading-relaxed">
            {selectedPreset.usageHint}
          </span>
        </div>
      )}

      {selectedPreset?.simplified && (
        <button
          onClick={() => {
            const next = !useSimplified
            setUseSimplified(next)
            if (next && selectedPreset.simplified) {
              setCommand(selectedPreset.simplified)
            } else {
              setCommand(selectedPreset.command)
            }
          }}
          disabled={isExecuting}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            useSimplified
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
          } disabled:opacity-50`}
          title={useSimplified ? t.editor.switchToFull : t.editor.switchToSimplified}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{useSimplified ? t.editor.switchToFull : t.editor.switchToSimplified}</span>
        </button>
      )}

      {hasMultipleFiles && (
        <div className="flex items-center gap-2 p-2 bg-dark-700/50 rounded-lg">
          <button
            onClick={toggleBatchMode}
            disabled={isExecuting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              isBatchMode 
                ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
                : 'bg-dark-600 text-dark-300 hover:bg-dark-500'
            } disabled:opacity-50`}
          >
            <Layers className="w-3.5 h-3.5" />
            {t.editor.batchMode}
          </button>
          <span className="text-xs text-dark-400">
            {files.length} {t.uploader.filesCount}
          </span>
          {isBatchMode && (
            <span className="text-xs text-neon-green">
              → {t.editor.executeBatch}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleExecute}
          disabled={!canExecute}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            canExecute
              ? hasMultipleFiles && isBatchMode
                ? 'bg-neon-blue text-white hover:shadow-neon hover:scale-105'
                : 'bg-neon-green text-dark-900 hover:shadow-neon hover:scale-105'
              : 'bg-dark-600 text-dark-300 cursor-not-allowed'
          }`}
        >
          {isExecuting ? (
            <>
              <Square className="w-4 h-4" />
              <span>{t.editor.executing}</span>
            </>
          ) : hasMultipleFiles && isBatchMode ? (
            <>
              <Layers className="w-4 h-4" />
              <span>{t.editor.executeBatch}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>{t.editor.execute}</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          disabled={isExecuting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-dark-700 text-dark-200 hover:bg-dark-600 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.editor.reset}</span>
        </button>

        <button
          onClick={() => setFastMode(!fastMode)}
          disabled={isExecuting}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            fastMode
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
          } disabled:opacity-50`}
          title="快速模式：使用 ultrafast 预设加速编码"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{fastMode ? '快速模式' : '标准模式'}</span>
        </button>

        {files.length === 0 && (
          <p className="text-dark-300 text-sm ml-auto">
            <span className="text-yellow-400">*</span> {t.editor.noFile}
          </p>
        )}

        {hasMultipleFiles && !isBatchMode && (
          <p className="text-dark-400 text-xs ml-auto flex items-center gap-1">
            <FileVideo className="w-3 h-3" />
            {t.editor.singleMode}
          </p>
        )}
      </div>

      {selectedPreset && segments.length > 0 ? (
        <div className="rounded-lg border border-dark-500/50 overflow-hidden">
          <button
            onClick={toggleSegments}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-dark-700/50 hover:bg-dark-700 transition-colors text-left"
          >
            <Info className="w-4 h-4 text-neon-green shrink-0" />
            <span className="text-dark-100 text-sm font-medium flex-1">
              {t.editor.segmentsTitle}
            </span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-yellow-400">
                <Pencil className="w-3 h-3" />
                {t.editor.editableLabel}
              </span>
              {expandedSegments ? (
                <ChevronDown className="w-4 h-4 text-dark-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-dark-400" />
              )}
            </div>
          </button>

          {expandedSegments && (
            <div className="p-3 bg-dark-800/50 space-y-2">
              {segments
                .filter(s => s.type !== 'separator')
                .map((segment, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 p-2 rounded-md border ${getSegmentBg(segment)}`}
                >
                  <code className="text-xs font-mono bg-dark-900/50 px-2 py-0.5 rounded shrink-0 max-w-[200px] truncate">
                    {segment.text}
                  </code>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed">
                      {isEditableSegment(segment) && (
                        <span className="inline-flex items-center gap-0.5 text-yellow-400 mr-1">
                          <Pencil className="w-2.5 h-2.5" />
                        </span>
                      )}
                      {segment.description}
                    </p>
                  </div>
                  {getSegmentIcon(segment)}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 bg-dark-700/50 rounded-lg border border-dark-500/50">
          <p className="text-dark-300 text-xs leading-relaxed">
            <span className="text-neon-green">{t.editor.tipTitle}</span>
            {t.editor.tipContent}
          </p>
        </div>
      )}
    </div>
  )
}

export default CommandEditor
