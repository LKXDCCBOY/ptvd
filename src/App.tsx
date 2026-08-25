import React, { useEffect, useRef, useState } from 'react'
import FileUploader from './components/FileUploader'
import CommandEditor from './components/CommandEditor'
import LogPanel from './components/LogPanel'
import OutputPanel from './components/OutputPanel'
import PresetTemplates from './components/PresetTemplates'
import HistoryPanel from './components/HistoryPanel'
import ProgressBar from './components/ProgressBar'
import LanguageSelector from './components/LanguageSelector'
import { Cpu, Info, Loader2, Play } from 'lucide-react'
import { useI18n } from './i18n'
import { useFFmpegStore } from './store/ffmpegStore'

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

const App: React.FC = () => {
  const { t } = useI18n()
  const { status, progress, error, loadStatus, initFFmpeg } = useFFmpegStore()
  const initializedRef = useRef(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (!initializedRef.current && status === 'idle') {
      initializedRef.current = true
      if (hasInitializedBefore()) {
        setShowWelcome(true)
      } else {
        initFFmpeg()
      }
    }
  }, [status, initFFmpeg])

  if (status === 'idle' && showWelcome) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="relative w-24 h-24 mx-auto">
            <Cpu className="w-24 h-24 text-neon-green" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-dark-100">{t.app.welcomeBack}</h2>
            <p className="text-dark-300 text-sm">{t.app.needInitTip}</p>
          </div>
          <button
            onClick={() => {
              setShowWelcome(false)
              initFFmpeg()
            }}
            className="px-8 py-3 bg-gradient-to-r from-neon-green to-neon-blue text-dark-900 rounded-lg font-bold text-base hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            {t.app.startEngine}
          </button>
          <p className="text-dark-400 text-xs">{t.app.loadingTimeHint}</p>
        </div>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center space-y-6 w-full max-w-md mx-auto px-4">
          <div className="relative w-24 h-24 mx-auto">
            <Cpu className="w-24 h-24 text-neon-green animate-pulse" />
            <Loader2 className="w-10 h-10 text-neon-blue absolute -right-2 -bottom-2 animate-spin bg-dark-900 rounded-full p-1" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-dark-100">{t.app.loadingFFmpeg}</h2>
            <p className="text-dark-300 text-sm">{t.app.loadingTip}</p>
          </div>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs text-dark-400">
              <span>{t.app.loadingProgress}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-blue to-neon-green transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            {loadStatus && (
              <p className="text-dark-400 text-xs mt-2">{loadStatus}</p>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-left">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-400 text-xs font-medium">加载失败</p>
                    <p className="text-red-300/80 text-xs mt-1 break-all">{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => initFFmpeg()}
                  className="mt-3 w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs rounded transition-colors"
                >
                  {t.app.retryInit}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="p-4 rounded-full bg-red-500/20 mx-auto w-fit">
            <Info className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-dark-100">{t.app.initFailed}</h2>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-left">
              <p className="text-red-300/80 text-sm break-all">{error}</p>
            </div>
          )}
          <p className="text-dark-400 text-sm">{t.app.initFailedTip}</p>
          <button
            onClick={() => initFFmpeg()}
            className="mt-4 px-6 py-2 bg-neon-green text-dark-900 rounded-lg font-medium hover:bg-neon-green/90 transition-colors"
          >
            {t.app.retryInit}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 text-dark-100">
      <div className="fixed inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 -z-10" />
      <div
        className="fixed inset-0 opacity-[0.03] -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <header className="border-b border-dark-600/50 bg-dark-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-green/10">
              <Cpu className="w-6 h-6 text-neon-green" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-dark-100">{t.app.title}</h1>
              <p className="text-dark-300 text-xs">{t.app.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-dark-300 text-sm">
              <Info className="w-4 h-4" />
              <span>{t.app.browserWarning}</span>
            </div>
            <LanguageSelector />
            <a
              href="https://ptstudio.top"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-200 hover:text-dark-100 text-sm transition-colors"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">{t.app.about}</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 space-y-6">
            <section className="bg-dark-800 rounded-xl border border-dark-500 p-4">
              <FileUploader />
            </section>

            <section className="bg-dark-800 rounded-xl border border-dark-500 p-4">
              <PresetTemplates />
            </section>
          </aside>

          <section className="lg:col-span-6 space-y-6">
            <div className="bg-dark-800 rounded-xl border border-dark-500 p-4 space-y-4">
              <ProgressBar />
              <CommandEditor />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-dark-800 rounded-xl border border-dark-500 p-4">
                <LogPanel />
              </div>
              <div className="bg-dark-800 rounded-xl border border-dark-500 p-4">
                <OutputPanel />
              </div>
            </div>
          </section>

          <aside className="lg:col-span-3 space-y-6">
            <section className="bg-dark-800 rounded-xl border border-dark-500 p-4">
              <HistoryPanel />
            </section>

            <section className="bg-dark-800 rounded-xl border border-dark-500 p-4">
              <h3 className="text-dark-100 text-sm font-medium mb-3">{t.app.tips}</h3>
              <ul className="space-y-2 text-dark-300 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-neon-green mt-0.5">•</span>
                  <span>{t.app.tip1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-green mt-0.5">•</span>
                  <span>{t.app.tip2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-green mt-0.5">•</span>
                  <span>{t.app.tip3}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon-green mt-0.5">•</span>
                  <span>{t.app.tip4}</span>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </main>

      <footer className="border-t border-dark-600/50 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-dark-400 text-sm">
          {t.app.footer}
        </div>
      </footer>
    </div>
  )
}

export default App
