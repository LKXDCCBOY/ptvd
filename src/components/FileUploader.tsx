import React, { useCallback, useState } from 'react'
import { Upload, FileVideo, X, Music, Image, AlertTriangle, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useFFmpegStore } from '../store/ffmpegStore'
import { generateId, formatFileSize } from '../utils/helpers'
import { validateFileSize, sanitizeFileName } from '../utils/security'
import { VideoFile } from '../types'
import { useI18n } from '../i18n'

const FileUploader: React.FC = () => {
  const { files, addFile, removeFile, clearFiles, isExecuting } = useFFmpegStore()
  const [isDragging, setIsDragging] = useState(false)
  const { t } = useI18n()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    processFiles(selectedFiles)
  }, [])

  const processFiles = (fileList: File[]) => {
    fileList.forEach((file) => {
      if (!(file.type.startsWith('video/') || file.type.startsWith('audio/') || file.type.startsWith('image/') || file.name.match(/\.(mp4|webm|mov|avi|mkv|flv|wav|mp3|ogg|jpg|png)$/i))) {
        return
      }

      const sizeValidation = validateFileSize(file.size)
      if (!sizeValidation.valid) {
        alert(`${t.uploader.dragHint}\n\n${sizeValidation.errors.join('\n')}`)
        return
      }

      const safeName = sanitizeFileName(file.name)
      
      const videoFile: VideoFile = {
        id: generateId(),
        name: safeName,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        file,
        status: 'pending',
        progress: 0,
      }
      addFile(videoFile)
    })
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('video/')) return <FileVideo className="w-6 h-6 text-neon-blue" />
    if (type.startsWith('audio/')) return <Music className="w-6 h-6 text-neon-green" />
    return <Image className="w-6 h-6 text-yellow-400" />
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 text-neon-green animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'pending':
      default:
        return <Clock className="w-4 h-4 text-dark-400" />
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'processing':
        return t.uploader.processing
      case 'completed':
        return t.uploader.completed
      case 'error':
        return t.uploader.failed
      case 'pending':
      default:
        return t.uploader.pending
    }
  }

  const completedCount = files.filter(f => f.status === 'completed').length
  const failedCount = files.filter(f => f.status === 'error').length
  const processingCount = files.filter(f => f.status === 'processing').length

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-neon-green bg-neon-green/5 scale-105'
            : 'border-dark-400 hover:border-neon-blue hover:bg-dark-700/50'
        } ${isExecuting ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="video/*,audio/*,image/*"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileSelect}
          disabled={isExecuting}
        />
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-dark-600 flex items-center justify-center">
            <Upload className="w-7 h-7 text-neon-green" />
          </div>
          <div>
            <p className="text-dark-100 font-medium">{t.uploader.dragTitle}</p>
            <p className="text-dark-300 text-sm mt-1">{t.uploader.dragSubtitle}</p>
          </div>
          <p className="text-dark-300 text-xs">{t.uploader.dragHint}</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-dark-200 text-sm font-medium">
              {t.uploader.uploadedFiles} ({files.length} {t.uploader.filesCount})
            </h3>
            {!isExecuting && (
              <button
                onClick={clearFiles}
                className="text-xs text-dark-400 hover:text-red-400 transition-colors"
              >
                {t.uploader.clearAll}
              </button>
            )}
          </div>

          {files.length > 1 && (
            <div className="flex items-center gap-4 px-1 text-xs">
              {processingCount > 0 && (
                <span className="text-neon-green flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {processingCount} {t.uploader.processing}
                </span>
              )}
              {completedCount > 0 && (
                <span className="text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {completedCount} {t.uploader.completed}
                </span>
              )}
              {failedCount > 0 && (
                <span className="text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  {failedCount} {t.uploader.failed}
                </span>
              )}
            </div>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center gap-3 p-3 bg-dark-700 rounded-lg group transition-colors ${
                  file.status === 'error' ? 'border border-red-500/30' :
                  file.status === 'completed' ? 'border border-green-500/30' :
                  'hover:bg-dark-600'
                }`}
              >
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-dark-100 text-sm truncate">{file.name}</p>
                    <span className="flex items-center gap-1 text-xs text-dark-400">
                      {getStatusIcon(file.status)}
                      {getStatusText(file.status)}
                    </span>
                  </div>
                  <p className="text-dark-300 text-xs">{formatFileSize(file.size)}</p>
                  {file.status === 'error' && file.errorMessage && (
                    <p className="text-red-400 text-xs truncate">{file.errorMessage}</p>
                  )}
                  {file.status === 'processing' && file.progress !== undefined && (
                    <div className="mt-1 h-1 bg-dark-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-neon-green transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                {!isExecuting && file.status !== 'processing' && (
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 rounded-full bg-dark-600 hover:bg-red-500/20 hover:text-red-400 text-dark-300 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader
