import { FFmpeg } from '@ffmpeg/ffmpeg'
import workerURL from '@ffmpeg/ffmpeg/worker?url'
import { validateCommand, sanitizeCommand, validateFileName, sanitizeFileName } from '../utils/security'

console.log('[FFmpegService] Module loaded at', new Date().toISOString())

const LOAD_TIMEOUT = 120000  // 120秒

// Worker 文件 URL（由 Vite 处理）
const FFMPEG_WORKER_URL = workerURL || '/node_modules/@ffmpeg/ffmpeg/dist/esm/worker.js'

// CDN 源 - ESM 格式（Worker 使用 import() 加载）
const CDN_SOURCES = [
  {
    name: 'jsDelivr',
    coreURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
    wasmURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
  },
  {
    name: 'unpkg',
    coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
    wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
  },
]

// 开发模式代理源 - 通过 Vite 代理绕过 Windows 杀毒软件拦截
const DEV_PROXY_CDN = {
  name: 'dev-proxy',
  coreURL: '/ffmpeg-cdn/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
  wasmURL: '/ffmpeg-cdn/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
}

const IS_DEV = import.meta.env.DEV

// 缓存键前缀
const CACHE_KEY_PREFIX = 'ffmpeg_cache_v1_'
const CACHE_META_KEY = CACHE_KEY_PREFIX + 'meta'

// IndexedDB 缓存管理
class FFmpegCache {
  private dbName = 'ptvd_ffmpeg_cache'
  private dbVersion = 1
  private storeName = 'files'
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    if (this.db) {
      // 检查数据库连接是否仍然有效
      try {
        // 尝试一个简单的操作来验证连接
        this.db.transaction(this.storeName, 'readonly')
        return
      } catch {
        // 连接已失效（如数据库被删除），需要重新初始化
        this.db = null
      }
    }
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      request.onerror = () => reject(request.error)
    })
  }

  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation()
    } catch {
      // 数据库操作失败，重置连接并重试一次
      this.db = null
      return await operation()
    }
  }

  async get(key: string): Promise<Blob | null> {
    return this.withRetry(async () => {
      await this.init()
      return new Promise<Blob | null>((resolve) => {
        try {
          const tx = this.db!.transaction(this.storeName, 'readonly')
          const request = tx.objectStore(this.storeName).get(key)
          request.onsuccess = () => resolve(request.result || null)
          request.onerror = () => resolve(null)
        } catch {
          resolve(null)
        }
      })
    })
  }

  async set(key: string, blob: Blob): Promise<void> {
    return this.withRetry(async () => {
      await this.init()
      return new Promise<void>((resolve) => {
        try {
          const tx = this.db!.transaction(this.storeName, 'readwrite')
          tx.objectStore(this.storeName).put(blob, key)
          tx.oncomplete = () => resolve()
          tx.onerror = () => resolve()
        } catch {
          resolve()
        }
      })
    })
  }

  async getOrDownload(key: string, url: string, onProgress?: (loaded: number, total: number) => void): Promise<Blob> {
    const cached = await this.get(key)
    if (cached) {
      return cached
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to download ${key}: ${response.status}`)
    }

    const contentLength = parseInt(response.headers.get('Content-Length') || '0')
    const reader = response.body!.getReader()
    const chunks: Uint8Array[] = []
    let receivedLength = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      receivedLength += value.length
      // 只有在 contentLength 大于 0 时才报告进度
      if (contentLength > 0) {
        onProgress?.(receivedLength, contentLength)
      }
    }

    const blob = new Blob(chunks as BlobPart[], { 
      type: key.includes('.wasm') ? 'application/wasm' : 'application/javascript' 
    })
    await this.set(key, blob)
    return blob
  }

  async hasCache(): Promise<boolean> {
    // 检查是否有完整的缓存（需要 core 和 wasm 两个文件）
    // Worker 使用本地文件，不需要缓存
    const coreBlob = await this.get(CACHE_KEY_PREFIX + 'core')
    const wasmBlob = await this.get(CACHE_KEY_PREFIX + 'wasm')
    return !!(coreBlob && wasmBlob)
  }

  async getCachedFiles(): Promise<{ core: Blob; wasm: Blob } | null> {
    const coreBlob = await this.get(CACHE_KEY_PREFIX + 'core')
    const wasmBlob = await this.get(CACHE_KEY_PREFIX + 'wasm')
    
    if (coreBlob && wasmBlob) {
      return { core: coreBlob, wasm: wasmBlob }
    }
    return null
  }

  async saveFiles(core: Blob, wasm: Blob): Promise<void> {
    await Promise.all([
      this.set(CACHE_KEY_PREFIX + 'core', core),
      this.set(CACHE_KEY_PREFIX + 'wasm', wasm),
    ])
  }

  clear(): Promise<void> {
    return new Promise((resolve) => {
      const request = indexedDB.deleteDatabase(this.dbName)
      request.onsuccess = () => resolve()
      request.onerror = () => resolve()
    })
  }

  // 清理临时缓存文件（以 _tmp_ 开头的）
  async cleanupTempFiles(): Promise<void> {
    try {
      await this.init()
      return new Promise<void>((resolve) => {
        const tx = this.db!.transaction(this.storeName, 'readwrite')
        const store = tx.objectStore(this.storeName)
        const request = store.openCursor()
        const keysToDelete: string[] = []
        
        request.onsuccess = () => {
          const cursor = request.result
          if (cursor) {
            const key = cursor.key as string
            if (key.includes('_tmp_')) {
              keysToDelete.push(key)
            }
            cursor.continue()
          } else {
            // 批量删除临时文件
            keysToDelete.forEach(key => {
              store.delete(key)
            })
          }
        }
        
        tx.oncomplete = () => resolve()
        tx.onerror = () => resolve()
      })
    } catch {
      // 忽略清理错误
    }
  }
}

const cache = new FFmpegCache()

class FFmpegService {
  private ffmpeg: FFmpeg | null = null
  private isInitialized = false
  private logCallback: ((message: string) => void) | null = null
  private progressCallback: ((progress: number) => void) | null = null
  private statusCallback: ((status: string) => void) | null = null

  setLogCallback(callback: (message: string) => void) {
    this.logCallback = callback
  }

  setProgressCallback(callback: (progress: number) => void) {
    this.progressCallback = callback
  }

  setStatusCallback(callback: (status: string) => void) {
    this.statusCallback = callback
  }

  private parseCommand(command: string): string[] {
    const args: string[] = []
    let current = ''
    let inQuotes = false
    let quoteChar = ''

    for (let i = 0; i < command.length; i++) {
      const char = command[i]
      
      if (inQuotes) {
        if (char === quoteChar) {
          inQuotes = false
        } else {
          current += char
        }
      } else {
        if (char === '"' || char === "'") {
          inQuotes = true
          quoteChar = char
        } else if (char === ' ') {
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

    if (args[0] === 'ffmpeg' || args[0] === 'ffprobe') {
      args.shift()
    }

    return args
  }

  // 从缓存加载 FFmpeg（最高优先级）
  private async tryCachedSource(): Promise<boolean> {
    try {
      if (this.statusCallback) {
        this.statusCallback('检查本地缓存...')
      }
      if (this.logCallback) {
        this.logCallback('检查本地 FFmpeg 缓存...')
      }

      const cachedFiles = await cache.getCachedFiles()
      if (!cachedFiles) {
        console.log('[FFmpegService] 无本地缓存')
        return false
      }

      if (this.logCallback) {
        this.logCallback('发现本地缓存，加载中...')
      }

      // 开发模式：使用代理同源地址加载（绕过 Windows 杀毒软件对 Blob URL 的拦截）
      if (IS_DEV) {
        if (this.logCallback) {
          this.logCallback('开发模式：缓存存在，使用代理同源地址初始化...')
        }

        const success = await this.initFFmpeg(
          DEV_PROXY_CDN.coreURL,
          DEV_PROXY_CDN.wasmURL,
          undefined,
          LOAD_TIMEOUT
        )

        if (success) {
          if (this.logCallback) {
            this.logCallback('✓ 使用缓存命中 + 代理加载 FFmpeg 引擎')
          }
          return true
        }

        return false
      }

      // 生产模式：使用 Blob URL 加载缓存文件
      const coreBlobURL = URL.createObjectURL(cachedFiles.core)
      const wasmBlobURL = URL.createObjectURL(cachedFiles.wasm)

      if (this.logCallback) {
        this.logCallback('本地缓存加载完成，初始化 FFmpeg...')
      }

      const cdnFallback = { coreURL: CDN_SOURCES[0].coreURL, wasmURL: CDN_SOURCES[0].wasmURL }
      const success = await this.initFFmpeg(coreBlobURL, wasmBlobURL, cdnFallback, 30000)
      
      if (success) {
        if (this.logCallback) {
          this.logCallback('✓ 使用本地缓存的 FFmpeg 引擎')
        }
        return true
      } else {
        URL.revokeObjectURL(coreBlobURL)
        URL.revokeObjectURL(wasmBlobURL)
        return false
      }
    } catch (error) {
      console.error('[FFmpegService] 缓存加载失败:', error)
      if (this.logCallback) {
        this.logCallback(`✗ 缓存加载失败: ${(error as Error).message}`)
      }
      return false
    }
  }

  // 开发模式：通过 Vite 代理同源加载，绕过 Windows 杀毒软件拦截
  private async tryProxySource(): Promise<boolean> {
    if (this.statusCallback) {
      this.statusCallback('通过本地代理加载 FFmpeg 引擎...')
    }

    try {
      console.log('[FFmpegService] 开发模式：使用代理同源加载')
      
      if (this.logCallback) {
        this.logCallback('开发模式：使用代理同源加载 FFmpeg（绕过 Windows 安全限制）')
        this.logCallback('下载 FFmpeg 核心文件并缓存...')
      }

      const primaryCdn = CDN_SOURCES[0]

      const coreBlob = await this.downloadWithProgress(
        primaryCdn.coreURL,
        CACHE_KEY_PREFIX + 'core_tmp_proxy',
        0, 0.4,
        (p) => { if (this.progressCallback) this.progressCallback(p) }
      )

      const wasmBlob = await this.downloadWithProgress(
        primaryCdn.wasmURL,
        CACHE_KEY_PREFIX + 'wasm_tmp_proxy',
        0.4, 0.8,
        (p) => { if (this.progressCallback) this.progressCallback(p) }
      )

      if (this.logCallback) {
        this.logCallback('核心文件就绪，通过代理同源地址初始化引擎...')
      }

      const success = await this.initFFmpeg(
        DEV_PROXY_CDN.coreURL,
        DEV_PROXY_CDN.wasmURL,
        undefined,
        LOAD_TIMEOUT
      )

      if (success) {
        await cache.saveFiles(coreBlob, wasmBlob)
        cache.cleanupTempFiles()
        
        if (this.logCallback) {
          this.logCallback('✓ FFmpeg 引擎就绪并已缓存')
        }
        return true
      }

      return false
    } catch (error: any) {
      console.error('[FFmpegService] 代理加载失败:', error)
      const msg = error?.message || String(error)
      if (this.logCallback) {
        this.logCallback(`✗ 代理加载失败: ${msg}`)
      }
      return false
    }
  }

  // 从 CDN 下载 FFmpeg 并缓存
  private async tryRemoteSource(): Promise<boolean> {
    if (this.statusCallback) {
      this.statusCallback('从 CDN 下载 FFmpeg 引擎...')
    }

    for (const cdn of CDN_SOURCES) {
      try {
        console.log(`[FFmpegService] 尝试 CDN: ${cdn.name}`)
        
        if (this.logCallback) {
          this.logCallback(`尝试 CDN: ${cdn.name}`)
          this.logCallback('下载 FFmpeg 核心文件...')
        }

        // 下载 core.js（进度 0-40%）
        const coreBlob = await this.downloadWithProgress(
          cdn.coreURL,
          CACHE_KEY_PREFIX + 'core_tmp_' + cdn.name,
          0, 0.4,
          (p) => { if (this.progressCallback) this.progressCallback(p) }
        )

        if (this.logCallback) {
          this.logCallback('下载 WASM 模块...')
        }

        // 下载 wasm（进度 40-80%）
        const wasmBlob = await this.downloadWithProgress(
          cdn.wasmURL,
          CACHE_KEY_PREFIX + 'wasm_tmp_' + cdn.name,
          0.4, 0.8,
          (p) => { if (this.progressCallback) this.progressCallback(p) }
        )

        // 创建 Blob URL 并初始化（进度 80-95%）
        if (this.logCallback) {
          this.logCallback('核心文件下载完成，初始化引擎...')
        }

        const coreBlobURL = URL.createObjectURL(coreBlob)
        const wasmBlobURL = URL.createObjectURL(wasmBlob)

        const cdnFallback = { coreURL: cdn.coreURL, wasmURL: cdn.wasmURL }
        const success = await this.initFFmpeg(coreBlobURL, wasmBlobURL, cdnFallback, 30000)
        
        if (success) {
          await cache.saveFiles(coreBlob, wasmBlob)
          cache.cleanupTempFiles()
          
          if (this.logCallback) {
            this.logCallback('✓ FFmpeg 引擎就绪并已缓存')
          }
          return true
        } else {
          URL.revokeObjectURL(coreBlobURL)
          URL.revokeObjectURL(wasmBlobURL)
        }
      } catch (error: any) {
        console.error(`[FFmpegService] ${cdn.name} 失败:`, error)
        const msg = error?.message || String(error)
        if (this.logCallback) {
          this.logCallback(`✗ ${cdn.name} 失败: ${msg}`)
        }
        if (this.statusCallback) {
          const shortMsg = msg.length > 60 ? msg.slice(0, 60) + '...' : msg
          this.statusCallback(`${cdn.name} 加载失败 (${shortMsg})，尝试下一个...`)
        }
      }
    }

    return false
  }

  private async downloadWithProgress(
    url: string, 
    cacheKey: string, 
    progressStart: number, 
    progressEnd: number,
    onProgress: (progress: number) => void
  ): Promise<Blob> {
    const cached = await cache.get(cacheKey)
    if (cached) {
      if (this.logCallback) {
        this.logCallback('使用已下载的临时缓存...')
      }
      onProgress(progressEnd)
      return cached
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`下载失败 (${response.status}): ${url}`)
    }

    const contentLength = parseInt(response.headers.get('Content-Length') || '0')
    const reader = response.body!.getReader()
    const chunks: Uint8Array[] = []
    let receivedLength = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      receivedLength += value.length
      
      if (contentLength > 0) {
        const downloadProgress = receivedLength / contentLength
        const mappedProgress = progressStart + downloadProgress * (progressEnd - progressStart)
        onProgress(Math.min(mappedProgress, progressEnd))
      }
    }

    const isWasm = url.endsWith('.wasm')
    const blob = new Blob(chunks as BlobPart[], { 
      type: isWasm ? 'application/wasm' : 'application/javascript' 
    })

    await cache.set(cacheKey, blob)
    onProgress(progressEnd)
    return blob
  }

  private async initFFmpeg(
    coreURL: string, 
    wasmURL: string,
    cdnFallback?: { coreURL: string, wasmURL: string },
    timeoutMs: number = LOAD_TIMEOUT
  ): Promise<boolean> {
    try {
      if (this.ffmpeg) {
        try { await this.ffmpeg.terminate() } catch {}
        this.ffmpeg = null
      }

      this.ffmpeg = new FFmpeg()
      
      this.ffmpeg.on('log', ({ message }: { message: string }) => {
        if (this.logCallback) {
          this.logCallback(message)
        }
      })
      
      this.ffmpeg.on('progress', ({ progress }: { progress: number }) => {
        if (this.progressCallback) {
          this.progressCallback(0.8 + Math.min(progress, 1) * 0.15)
        }
      })

      const config = { 
        coreURL, 
        wasmURL
      }

      if (this.progressCallback) {
        this.progressCallback(0.8)
      }

      const loadPromise = this.ffmpeg.load(config)
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error(`加载超时（${Math.round(timeoutMs / 1000)}秒）`)), timeoutMs)
      })

      await Promise.race([loadPromise, timeoutPromise])
      
      this.isInitialized = true
      if (this.statusCallback) {
        this.statusCallback('引擎就绪')
      }
      if (this.logCallback) {
        this.logCallback('✓ FFmpeg 引擎就绪')
      }
      console.log('[FFmpegService] FFmpeg loaded successfully')
      return true
    } catch (error) {
      console.error('[FFmpegService] initFFmpeg failed:', error)
      
      if (cdnFallback && coreURL.startsWith('blob:')) {
        console.log('[FFmpegService] Blob URL 加载失败，降级为 CDN URL...')
        if (this.logCallback) {
          this.logCallback('本地 Blob 加载超时，尝试 CDN 直接加载...')
        }
        URL.revokeObjectURL(coreURL)
        URL.revokeObjectURL(wasmURL)
        return this.initFFmpeg(cdnFallback.coreURL, cdnFallback.wasmURL, undefined, LOAD_TIMEOUT)
      }
      
      if (this.logCallback) {
        this.logCallback(`✗ 初始化失败: ${(error as Error).message}`)
      }
      return false
    }
  }

  async init(): Promise<void> {
    if (this.isInitialized && this.ffmpeg) {
      return
    }

    const supportInfo = this.checkBrowserSupport()
    if (!supportInfo.supported) {
      throw new Error(supportInfo.message)
    }

    if (this.logCallback) {
      this.logCallback('开始初始化 FFmpeg 引擎...')
    }

    // 最高优先级：检查本地缓存（用户之前下载的）
    const cachedSuccess = await this.tryCachedSource()
    
    if (cachedSuccess) {
      return
    }

    if (IS_DEV) {
      if (this.logCallback) {
        this.logCallback('开发模式：无本地缓存，尝试代理同源加载...')
      }

      // 开发模式优先使用代理同源加载（绕过 Windows 杀毒软件拦截）
      const proxySuccess = await this.tryProxySource()
      if (proxySuccess) {
        return
      }

      if (this.logCallback) {
        this.logCallback('代理加载失败，尝试远程 CDN 直连...')
      }
    } else {
      if (this.logCallback) {
        this.logCallback('无本地缓存，从远程 CDN 下载 FFmpeg 引擎（首次访问需要下载约 30MB）...')
      }
    }

    // 从远程 CDN 下载并缓存
    const remoteSuccess = await this.tryRemoteSource()
    
    if (remoteSuccess) {
      return
    }

    throw new Error('所有加载源均不可用，请检查网络连接。建议使用支持 SharedArrayBuffer 的现代浏览器，并检查防火墙设置。')
  }

  private checkBrowserSupport(): { supported: boolean; message: string } {
    // 检查 crossOriginIsolated（最可靠的方式）
    if (typeof crossOriginIsolated !== 'undefined' && !crossOriginIsolated) {
      return {
        supported: false,
        message: '当前页面未启用跨域隔离（缺少 COOP/COEP 安全头），FFmpeg.wasm 无法运行。请联系网站管理员配置正确的 HTTP 响应头。'
      }
    }

    // 检查 SharedArrayBuffer 是否存在
    if (typeof SharedArrayBuffer === 'undefined') {
      return {
        supported: false,
        message: '您的浏览器不支持 SharedArrayBuffer，FFmpeg.wasm 无法正常运行。请使用最新版 Chrome、Edge 或 Firefox，并确保网站启用了跨域隔离。'
      }
    }

    // 实际尝试创建 SharedArrayBuffer 验证
    try {
      new SharedArrayBuffer(1)
    } catch {
      return {
        supported: false,
        message: 'SharedArrayBuffer 虽然存在但无法使用（可能缺少跨域隔离头）。请检查网站的 HTTP 响应头配置。'
      }
    }

    return { supported: true, message: '' }
  }

  async writeFile(fileName: string, file: File): Promise<void> {
    if (!this.ffmpeg) throw new Error('FFmpeg 未初始化')

    const nameValidation = validateFileName(fileName)
    if (!nameValidation.valid) {
      throw new Error(`文件名验证失败: ${nameValidation.errors.join('; ')}`)
    }

    const sanitizedName = sanitizeFileName(fileName)
    if (sanitizedName !== fileName) {
      throw new Error('文件名包含不安全字符')
    }

    const fileBuffer = await file.arrayBuffer()
    await this.ffmpeg.writeFile(fileName, new Uint8Array(fileBuffer))
  }

  async writeTextFile(fileName: string, content: string): Promise<void> {
    if (!this.ffmpeg) throw new Error('FFmpeg 未初始化')

    const nameValidation = validateFileName(fileName)
    if (!nameValidation.valid) {
      throw new Error(`文件名验证失败: ${nameValidation.errors.join('; ')}`)
    }

    const sanitizedName = sanitizeFileName(fileName)
    if (sanitizedName !== fileName) {
      throw new Error('文件名包含不安全字符')
    }

    const encoder = new TextEncoder()
    await this.ffmpeg.writeFile(fileName, encoder.encode(content))
  }

  async writeBinaryFile(fileName: string, data: Uint8Array | ArrayBuffer): Promise<void> {
    if (!this.ffmpeg) throw new Error('FFmpeg 未初始化')

    const nameValidation = validateFileName(fileName)
    if (!nameValidation.valid) {
      throw new Error(`文件名验证失败: ${nameValidation.errors.join('; ')}`)
    }

    const sanitizedName = sanitizeFileName(fileName)
    if (sanitizedName !== fileName) {
      throw new Error('文件名包含不安全字符')
    }

    const u8 = data instanceof Uint8Array ? data : new Uint8Array(data)
    await this.ffmpeg.writeFile(fileName, u8)
  }

  async execute(command: string, onProgress?: (progress: number) => void): Promise<{ blobs: { name: string, blob: Blob }[] }> {
    if (!this.ffmpeg) throw new Error('FFmpeg 未初始化')

    const validation = validateCommand(command)
    if (!validation.valid) {
      throw new Error(`命令验证失败: ${validation.errors.join('; ')}`)
    }

    const sanitizedCommand = sanitizeCommand(command)
    const args = this.parseCommand(sanitizedCommand)
    
    this.logCallback?.(`执行命令: ${sanitizedCommand}`)

    if (onProgress) {
      this.ffmpeg.on('progress', ({ progress }: { progress: number }) => {
        onProgress(progress)
      })
    }

    try {
      const exitCode = await this.ffmpeg.exec(args)
      
      if (exitCode !== 0) {
        throw new Error(`命令执行失败，退出码: ${exitCode}。可能原因：文件过大、编码器不支持或输入文件格式问题。`)
      }

      const outputFiles: any[] = await this.ffmpeg.listDir('/')
      const outputExtensions = ['.mp4', '.webm', '.mov', '.avi', '.gif', '.jpg', '.png', '.wav', '.mp3', '.ogg', '.flv', '.mkv']
      const foundFiles = outputFiles.filter((f: any) => !f.isDir && outputExtensions.some(ext => f.name.endsWith(ext)))
      
      if (foundFiles.length === 0) {
        throw new Error('命令执行成功但没有找到输出文件')
      }

      const blobs: { name: string, blob: Blob }[] = []
      for (const file of foundFiles) {
        const fileData = await this.ffmpeg.readFile(file.name)
        this.ffmpeg.deleteFile(file.name)
        let blob: Blob
        if (typeof fileData === 'string') {
          blob = new Blob([fileData])
        } else if (fileData instanceof ArrayBuffer) {
          blob = new Blob([fileData])
        } else {
          const u8 = new Uint8Array(fileData as unknown as ArrayBuffer)
          blob = new Blob([u8.buffer as ArrayBuffer])
        }
        blobs.push({ name: file.name, blob })
      }

      // 清理临时文件
      const remainingFiles: any[] = await this.ffmpeg.listDir('/')
      for (const f of remainingFiles) {
        if (!f.isDir && !f.name.startsWith('input_file') && !f.name.startsWith('batch_file')) {
          try { await this.ffmpeg.deleteFile(f.name) } catch {}
        }
      }

      return { blobs }
    } catch (error: any) {
      const errMsg = error?.message || String(error)
      
      if (errMsg.includes('memory access out of bounds') || errMsg.includes('RuntimeError')) {
        this.logCallback?.('⚠ 检测到内存错误，正在清理...')
        try {
          const allFiles: any[] = await this.ffmpeg.listDir('/')
          for (const f of allFiles) {
            if (!f.isDir) {
              try { await this.ffmpeg.deleteFile(f.name) } catch {}
            }
          }
        } catch {}
        throw new Error('内存访问越界错误。可能原因：文件过大（建议小于 100MB）、WASM 内存不足或编码器不兼容。建议：1) 使用更小的文件 2) 使用 H.264 编码器 3) 关闭其他占用内存的标签页')
      }
      
      throw error
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    if (!this.ffmpeg) return
    await this.ffmpeg.deleteFile(fileName)
  }

  // 清除本地缓存
  async clearCache(): Promise<void> {
    await cache.clear()
    if (this.logCallback) {
      this.logCallback('✓ FFmpeg 缓存已清除')
    }
  }

  destroy(): void {
    if (this.ffmpeg) {
      try {
        this.ffmpeg.terminate()
      } catch {}
      this.ffmpeg = null
      this.isInitialized = false
    }
  }
}

export const ffmpegService = new FFmpegService()
