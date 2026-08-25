export type LanguageCode = 'zh' | 'en' | 'ja' | 'ru' | 'de' | 'fr'

export const languageLabels: Record<LanguageCode, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ru: 'Русский',
  de: 'Deutsch',
  fr: 'Français',
}

export type TranslationKeys = {
  app: {
    title: string
    subtitle: string
    browserWarning: string
    about: string
    tips: string
    tip1: string
    tip2: string
    tip3: string
    tip4: string
    footer: string
    loadingFFmpeg: string
    loadingTip: string
    loadingProgress: string
    initFailed: string
    initFailedTip: string
    retryInit: string
    welcomeBack: string
    needInitTip: string
    startEngine: string
    loadingTimeHint: string
  }
  uploader: {
    dragTitle: string
    dragSubtitle: string
    dragHint: string
    uploadedFiles: string
    clearAll: string
    filesCount: string
    processing: string
    completed: string
    failed: string
    pending: string
  }
  editor: {
    title: string
    executing: string
    execute: string
    executeBatch: string
    reset: string
    noFile: string
    tipTitle: string
    tipContent: string
    batchMode: string
    singleMode: string
    segmentsTitle: string
    editableLabel: string
    currentFile: string
    batchProgress: string
    complexLabel: string
    wasmWarningLabel: string
    wasmWarningText: string
    usageHintLabel: string
    simplifiedLabel: string
    switchToFull: string
    switchToSimplified: string
  }
  logs: {
    title: string
    clear: string
    empty: string
    emptyHint: string
    scrollBottom: string
    prefixOk: string
    prefixErr: string
    prefixWarn: string
    prefixInfo: string
    batchStart: string
    batchComplete: string
    batchFailed: string
    fileStart: string
    fileComplete: string
    fileFailed: string
  }
  output: {
    title: string
    empty: string
    emptyHint: string
    download: string
    downloadAll: string
    remove: string
    sourceFile: string
  }
  history: {
    title: string
    empty: string
    emptyHint: string
    inputs: string
    outputs: string
    copy: string
    use: string
    batch: string
    totalTime: string
  }
  status: {
    idle: string
    loading: string
    ready: string
    executing: string
    error: string
    processingFile: string
    batchComplete: string
  }
  presets: {
    title: string
    searchPlaceholder: string
    noResults: string
    complex: string
    wasmWarning: string
    categories: Record<string, string>
  }
}

const zh: TranslationKeys = {
  app: {
    title: 'PTVD',
    subtitle: 'Prism Technology Video Do',
    browserWarning: '需要支持 SharedArrayBuffer 的现代浏览器',
    about: '关于',
    tips: '使用提示',
    tip1: '首次使用需要加载 FFmpeg.wasm 引擎（约 30MB）',
    tip2: '大文件处理受浏览器内存限制，建议小于 500MB',
    tip3: '使用 input 作为输入文件占位符',
    tip4: '所有处理均在浏览器本地完成，文件不会上传',
    footer: '©2026PTStudio',
    loadingFFmpeg: '正在加载 FFmpeg 引擎',
    loadingTip: '首次使用需要下载约 30MB 的引擎文件，请耐心等待',
    loadingProgress: '下载进度',
    initFailed: '初始化失败',
    initFailedTip: '无法加载 FFmpeg 引擎，请检查网络连接或使用支持 SharedArrayBuffer 的现代浏览器',
    retryInit: '重试',
    welcomeBack: '欢迎回来',
    needInitTip: 'FFmpeg 引擎需要重新加载才能使用。由于浏览器安全限制，每次刷新页面都需要重新初始化。',
    startEngine: '启动引擎',
    loadingTimeHint: '加载时间取决于网络速度，通常需要几秒钟',
  },
  uploader: {
    dragTitle: '拖拽文件到这里',
    dragSubtitle: '或者点击选择文件',
    dragHint: '支持 MP4, WebM, MOV, MP3, WAV 等格式，支持批量上传',
    uploadedFiles: '已上传文件',
    clearAll: '清空全部',
    filesCount: '个文件',
    processing: '处理中',
    completed: '已完成',
    failed: '失败',
    pending: '等待中',
  },
  editor: {
    title: '命令编辑器',
    executing: '执行中...',
    execute: '执行命令',
    executeBatch: '批量执行',
    reset: '重置',
    noFile: '请先上传文件',
    tipTitle: '提示：',
    tipContent: '使用 input 作为输入文件名占位符，执行时会自动替换为您上传的文件名。使用 output.mp4 作为输出文件名。',
    batchMode: '批量模式',
    singleMode: '单文件模式',
    segmentsTitle: '指令片段解析',
    editableLabel: '可编辑',
    currentFile: '当前文件',
    batchProgress: '批量进度',
    complexLabel: '高级指令',
    wasmWarningLabel: 'WASM限制',
    wasmWarningText: '此功能在浏览器WASM环境中可能受限',
    usageHintLabel: '使用提示',
    simplifiedLabel: '简化命令',
    switchToFull: '切换到完整命令',
    switchToSimplified: '切换到简化命令',
  },
  logs: {
    title: '执行日志',
    clear: '清空',
    empty: '暂无日志输出',
    emptyHint: '执行命令后将显示日志',
    scrollBottom: '滚动到底部',
    prefixOk: '[OK]',
    prefixErr: '[ERR]',
    prefixWarn: '[WARN]',
    prefixInfo: '[INFO]',
    batchStart: '开始批量处理',
    batchComplete: '批量处理完成',
    batchFailed: '批量处理部分失败',
    fileStart: '开始处理文件',
    fileComplete: '文件处理完成',
    fileFailed: '文件处理失败',
  },
  output: {
    title: '输出文件',
    empty: '暂无输出文件',
    emptyHint: '执行命令后将显示结果',
    download: '下载文件',
    downloadAll: '打包下载全部',
    remove: '移除',
    sourceFile: '来源文件',
  },
  history: {
    title: '历史记录',
    empty: '暂无历史记录',
    emptyHint: '执行命令后将保存记录',
    inputs: '个输入',
    outputs: '个输出',
    copy: '复制命令',
    use: '使用此命令',
    batch: '批量任务',
    totalTime: '总耗时',
  },
  status: {
    idle: '等待初始化',
    loading: '正在加载引擎...',
    ready: '就绪',
    executing: '执行中...',
    error: '错误',
    processingFile: '正在处理文件',
    batchComplete: '批量处理完成',
  },
  presets: {
    title: '预设模板',
    searchPlaceholder: '搜索命令模板...',
    noResults: '未找到匹配的模板',
    complex: '高级指令',
    wasmWarning: 'WASM限制',
    categories: {
      all: '全部',
      convert: '格式转换',
      audio: '音频处理',
      compress: '视频压缩',
      edit: '剪辑编辑',
      filter: '滤镜效果',
      extract: '帧提取',
      subtitle: '字幕',
      watermark: '水印叠加',
      gif: 'GIF 动画',
      stream: '直播流',
      advanced: '高级操作',
      diagnose: '诊断修复',
    },
  },
}

const en: TranslationKeys = {
  app: {
    title: 'PTVD',
    subtitle: 'Prism Technology Video Do',
    browserWarning: 'Requires a modern browser with SharedArrayBuffer support',
    about: 'About',
    tips: 'Tips',
    tip1: 'First-time use requires loading the FFmpeg.wasm engine (~30MB)',
    tip2: 'Large files are limited by browser memory, recommended < 500MB',
    tip3: 'Use input as a placeholder for the input file',
    tip4: 'All processing is done locally in your browser, files are not uploaded',
    footer: '©2026PTStudio',
    loadingFFmpeg: 'Loading FFmpeg Engine',
    loadingTip: 'First-time use requires downloading ~30MB of engine files. Please wait.',
    loadingProgress: 'Download Progress',
    initFailed: 'Initialization Failed',
    initFailedTip: 'Unable to load FFmpeg engine. Please check your network connection or use a modern browser with SharedArrayBuffer support.',
    retryInit: 'Retry',
    welcomeBack: 'Welcome Back',
    needInitTip: 'The FFmpeg engine needs to be reloaded to work. Due to browser security restrictions, reloading the page requires reinitialization.',
    startEngine: 'Start Engine',
    loadingTimeHint: 'Loading time depends on network speed, usually takes a few seconds',
  },
  uploader: {
    dragTitle: 'Drag & drop files here',
    dragSubtitle: 'or click to select files',
    dragHint: 'Supports MP4, WebM, MOV, MP3, WAV and more. Batch upload supported',
    uploadedFiles: 'Uploaded files',
    clearAll: 'Clear all',
    filesCount: 'files',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    pending: 'Pending',
  },
  editor: {
    title: 'Command Editor',
    executing: 'Executing...',
    execute: 'Execute Command',
    executeBatch: 'Batch Execute',
    reset: 'Reset',
    noFile: 'Upload a file first',
    tipTitle: 'Tip: ',
    tipContent: 'Use input as a placeholder for the input filename. It will be automatically replaced with your uploaded filename. Use output.mp4 as the output filename.',
    batchMode: 'Batch Mode',
    singleMode: 'Single Mode',
    segmentsTitle: 'Command Breakdown',
    editableLabel: 'Editable',
    currentFile: 'Current File',
    batchProgress: 'Batch Progress',
    complexLabel: 'Advanced',
    wasmWarningLabel: 'WASM Limitation',
    wasmWarningText: 'This feature may be limited in browser WASM environment',
    usageHintLabel: 'Usage Hint',
    simplifiedLabel: 'Simplified',
    switchToFull: 'Switch to full',
    switchToSimplified: 'Switch to simplified',
  },
  logs: {
    title: 'Execution Logs',
    clear: 'Clear',
    empty: 'No logs yet',
    emptyHint: 'Logs will appear after executing a command',
    scrollBottom: 'Scroll to bottom',
    prefixOk: '[OK]',
    prefixErr: '[ERR]',
    prefixWarn: '[WARN]',
    prefixInfo: '[INFO]',
    batchStart: 'Starting batch processing',
    batchComplete: 'Batch processing complete',
    batchFailed: 'Batch processing partially failed',
    fileStart: 'Processing file',
    fileComplete: 'File processing complete',
    fileFailed: 'File processing failed',
  },
  output: {
    title: 'Output Files',
    empty: 'No output files yet',
    emptyHint: 'Results will appear after executing a command',
    download: 'Download file',
    downloadAll: 'Download all as zip',
    remove: 'Remove',
    sourceFile: 'Source file',
  },
  history: {
    title: 'History',
    empty: 'No history yet',
    emptyHint: 'Commands will be saved after execution',
    inputs: 'inputs',
    outputs: 'outputs',
    copy: 'Copy command',
    use: 'Use this command',
    batch: 'Batch task',
    totalTime: 'Total time',
  },
  status: {
    idle: 'Waiting for initialization',
    loading: 'Loading engine...',
    ready: 'Ready',
    executing: 'Executing...',
    error: 'Error',
    processingFile: 'Processing file',
    batchComplete: 'Batch complete',
  },
  presets: {
    title: 'Preset Templates',
    searchPlaceholder: 'Search templates...',
    noResults: 'No matching templates found',
    complex: 'Advanced',
    wasmWarning: 'WASM Limitation',
    categories: {
      all: 'All',
      convert: 'Convert',
      audio: 'Audio',
      compress: 'Compress',
      edit: 'Edit',
      filter: 'Filters',
      extract: 'Extract Frames',
      subtitle: 'Subtitles',
      watermark: 'Watermark',
      gif: 'GIF',
      stream: 'Streaming',
      advanced: 'Advanced',
      diagnose: 'Diagnose',
    },
  },
}

const ja: TranslationKeys = {
  app: {
    title: 'PTVD',
    subtitle: 'Prism Technology Video Do',
    browserWarning: 'SharedArrayBuffer 対応の最新ブラウザが必要です',
    about: '概要',
    tips: 'ヒント',
    tip1: '初回使用時に FFmpeg.wasm エンジン（約 30MB）をロードします',
    tip2: '大きなファイルはブラウザのメモリ制限があります。500MB 以下を推奨',
    tip3: '入力ファイルのプレースホルダーとして input を使用',
    tip4: 'すべての処理はブラウザ内で完了します。ファイルはアップロードされません',
    footer: '©2026PTStudio',
    loadingFFmpeg: 'FFmpeg エンジンを読み込み中',
    loadingTip: '初回使用時に約 30MB のエンジンファイルをダウンロードします。お待ちください。',
    loadingProgress: 'ダウンロード進捗',
    initFailed: '初期化に失敗しました',
    initFailedTip: 'FFmpeg エンジンを読み込めません。ネットワーク接続を確認するか、SharedArrayBuffer 対応の最新ブラウザを使用してください。',
    retryInit: '再試行',
    welcomeBack: 'おかえりなさい',
    needInitTip: 'FFmpeg エンジンを再読み込みする必要があります。ブラウザのセキュリティ制限により、ページを更新するたびに再初期化が必要です。',
    startEngine: 'エンジン起動',
    loadingTimeHint: '読み込み時間はネットワーク速度に依存します。通常、数秒かかります。',
  },
  uploader: {
    dragTitle: 'ファイルをドラッグ＆ドロップ',
    dragSubtitle: 'またはクリックして選択',
    dragHint: 'MP4, WebM, MOV, MP3, WAV などに対応。一括アップロード可能',
    uploadedFiles: 'アップロード済みファイル',
    clearAll: 'すべてクリア',
    filesCount: '個のファイル',
    processing: '処理中',
    completed: '完了',
    failed: '失敗',
    pending: '待機中',
  },
  editor: {
    title: 'コマンドエディター',
    executing: '実行中...',
    execute: 'コマンド実行',
    executeBatch: '一括実行',
    reset: 'リセット',
    noFile: '先にファイルをアップロードしてください',
    tipTitle: 'ヒント: ',
    tipContent: 'input を入力ファイル名のプレースホルダーとして使用すると、アップロードしたファイル名に自動的に置き換わります。出力ファイル名には output.mp4 を使用してください。',
    batchMode: '一括モード',
    singleMode: '単一モード',
    segmentsTitle: 'コマンド解析',
    editableLabel: '編集可',
    currentFile: '現在のファイル',
    batchProgress: '一括進捗',
    complexLabel: '高度な指令',
    wasmWarningLabel: 'WASM制限',
    wasmWarningText: 'この機能はブラウザWASM環境で制限される場合があります',
    usageHintLabel: '使用ヒント',
    simplifiedLabel: '简化版',
    switchToFull: '完全版に切替',
    switchToSimplified: '简化版に切替',
  },
  logs: {
    title: '実行ログ',
    clear: 'クリア',
    empty: 'ログがありません',
    emptyHint: 'コマンド実行後にログが表示されます',
    scrollBottom: '最下部へスクロール',
    prefixOk: '[OK]',
    prefixErr: '[ERR]',
    prefixWarn: '[WARN]',
    prefixInfo: '[INFO]',
    batchStart: '一括処理開始',
    batchComplete: '一括処理完了',
    batchFailed: '一括処理で一部失敗',
    fileStart: 'ファイル処理開始',
    fileComplete: 'ファイル処理完了',
    fileFailed: 'ファイル処理失敗',
  },
  output: {
    title: '出力ファイル',
    empty: '出力ファイルがありません',
    emptyHint: 'コマンド実行後に結果が表示されます',
    download: 'ファイルダウンロード',
    downloadAll: 'すべてダウンロード',
    remove: '削除',
    sourceFile: 'ソースファイル',
  },
  history: {
    title: '履歴',
    empty: '履歴がありません',
    emptyHint: 'コマンド実行後に履歴が保存されます',
    inputs: '入力',
    outputs: '出力',
    copy: 'コマンドをコピー',
    use: 'このコマンドを使用',
    batch: '一括タスク',
    totalTime: '合計時間',
  },
  status: {
    idle: '初期化待ち',
    loading: 'エンジンを読み込み中...',
    ready: '準備完了',
    executing: '実行中...',
    error: 'エラー',
    processingFile: 'ファイル処理中',
    batchComplete: '一括処理完了',
  },
  presets: {
    title: 'プリセットテンプレート',
    searchPlaceholder: 'テンプレートを検索...',
    noResults: '一致するテンプレートが見つかりません',
    complex: '高度な指令',
    wasmWarning: 'WASM制限',
    categories: {
      all: 'すべて',
      convert: '変換',
      audio: '音声処理',
      compress: '圧縮',
      edit: '編集',
      filter: 'フィルター',
      extract: 'フレーム抽出',
      subtitle: '字幕',
      watermark: 'ウォーターマーク',
      gif: 'GIF',
      stream: 'ストリーミング',
      advanced: '高度な操作',
      diagnose: '診断',
    },
  },
}

const ru: TranslationKeys = {
  app: {
    title: 'PTVD',
    subtitle: 'Prism Technology Video Do',
    browserWarning: 'Требуется современный браузер с поддержкой SharedArrayBuffer',
    about: 'О проекте',
    tips: 'Советы',
    tip1: 'При первом использовании загружается движок FFmpeg.wasm (~30 МБ)',
    tip2: 'Большие файлы ограничены памятью браузера, рекомендуется < 500 МБ',
    tip3: 'Используйте input как плейсхолдер для входного файла',
    tip4: 'Вся обработка выполняется локально в браузере, файлы не загружаются',
    footer: '©2026PTStudio',
    loadingFFmpeg: 'Загрузка движка FFmpeg',
    loadingTip: 'При первом использовании необходимо скачать ~30 МБ файлов движка. Пожалуйста, подождите.',
    loadingProgress: 'Прогресс загрузки',
    initFailed: 'Инициализация не удалась',
    initFailedTip: 'Не удалось загрузить движок FFmpeg. Проверьте сетевое подключение или используйте современный браузер с поддержкой SharedArrayBuffer.',
    retryInit: 'Повторить',
    welcomeBack: 'С возвращением',
    needInitTip: 'Движок FFmpeg необходимо перезагрузить для работы. Из-за ограничений безопасности браузера перезагрузка страницы требует повторной инициализации.',
    startEngine: 'Запустить движок',
    loadingTimeHint: 'Время загрузки зависит от скорости сети, обычно занимает несколько секунд',
  },
  uploader: {
    dragTitle: 'Перетащите файлы сюда',
    dragSubtitle: 'или нажмите для выбора',
    dragHint: 'Поддерживаются MP4, WebM, MOV, MP3, WAV и другие. Пакетная загрузка',
    uploadedFiles: 'Загруженные файлы',
    clearAll: 'Очистить все',
    filesCount: 'файлов',
    processing: 'Обработка',
    completed: 'Завершено',
    failed: 'Ошибка',
    pending: 'В ожидании',
  },
  editor: {
    title: 'Редактор команд',
    executing: 'Выполняется...',
    execute: 'Выполнить команду',
    executeBatch: 'Пакетное выполнение',
    reset: 'Сбросить',
    noFile: 'Сначала загрузите файл',
    tipTitle: 'Совет: ',
    tipContent: 'Используйте input как плейсхолдер для имени входного файла — он будет автоматически заменён на имя вашего файла. Используйте output.mp4 как имя выходного файла.',
    batchMode: 'Пакетный режим',
    singleMode: 'Одиночный режим',
    segmentsTitle: 'Разбор команды',
    editableLabel: 'Редактируемый',
    currentFile: 'Текущий файл',
    batchProgress: 'Прогресс пакета',
    complexLabel: 'Сложная команда',
    wasmWarningLabel: 'Ограничение WASM',
    wasmWarningText: 'Эта функция может быть ограничена в среде WASM браузера',
    usageHintLabel: 'Подсказка',
    simplifiedLabel: 'Упрощенный',
    switchToFull: 'Переключить на полную',
    switchToSimplified: 'Переключить на упрощенную',
  },
  logs: {
    title: 'Журнал выполнения',
    clear: 'Очистить',
    empty: 'Нет журналов',
    emptyHint: 'Журналы появятся после выполнения команды',
    scrollBottom: 'Прокрутить вниз',
    prefixOk: '[OK]',
    prefixErr: '[ERR]',
    prefixWarn: '[WARN]',
    prefixInfo: '[INFO]',
    batchStart: 'Начало пакетной обработки',
    batchComplete: 'Пакетная обработка завершена',
    batchFailed: 'Пакетная обработка частично не удалась',
    fileStart: 'Обработка файла',
    fileComplete: 'Обработка файла завершена',
    fileFailed: 'Обработка файла не удалась',
  },
  output: {
    title: 'Выходные файлы',
    empty: 'Нет выходных файлов',
    emptyHint: 'Результаты появятся после выполнения команды',
    download: 'Скачать файл',
    downloadAll: 'Скачать все',
    remove: 'Удалить',
    sourceFile: 'Исходный файл',
  },
  history: {
    title: 'История',
    empty: 'Нет истории',
    emptyHint: 'Команды будут сохранены после выполнения',
    inputs: 'входов',
    outputs: 'выходов',
    copy: 'Копировать команду',
    use: 'Использовать эту команду',
    batch: 'Пакетная задача',
    totalTime: 'Общее время',
  },
  status: {
    idle: 'Ожидание инициализации',
    loading: 'Загрузка движка...',
    ready: 'Готово',
    executing: 'Выполняется...',
    error: 'Ошибка',
    processingFile: 'Обработка файла',
    batchComplete: 'Пакетная обработка завершена',
  },
  presets: {
    title: 'Пресеты',
    searchPlaceholder: 'Поиск пресетов...',
    noResults: 'Пресеты не найдены',
    complex: 'Сложная команда',
    wasmWarning: 'Ограничение WASM',
    categories: {
      all: 'Все',
      convert: 'Конвертация',
      audio: 'Аудио',
      compress: 'Сжатие',
      edit: 'Редактирование',
      filter: 'Фильтры',
      extract: 'Извлечение кадров',
      subtitle: 'Субтитры',
      watermark: 'Водяной знак',
      gif: 'GIF',
      stream: 'Поток',
      advanced: 'Дополнительно',
      diagnose: 'Диагностика',
    },
  },
}

const de: TranslationKeys = {
  app: {
    title: 'PTVD',
    subtitle: 'Prism Technology Video Do',
    browserWarning: 'Erfordert einen modernen Browser mit SharedArrayBuffer-Unterstützung',
    about: 'Über',
    tips: 'Tipps',
    tip1: 'Bei der ersten Nutzung wird die FFmpeg.wasm-Engine geladen (~30MB)',
    tip2: 'Große Dateien sind durch den Browserspeicher begrenzt, < 500MB empfohlen',
    tip3: 'Verwenden Sie input als Platzhalter für die Eingabedatei',
    tip4: 'Alle Verarbeitung erfolgt lokal im Browser, Dateien werden nicht hochgeladen',
    footer: '©2026PTStudio',
    loadingFFmpeg: 'FFmpeg-Engine wird geladen',
    loadingTip: 'Bei der ersten Nutzung müssen ~30MB Engine-Dateien heruntergeladen werden. Bitte warten Sie.',
    loadingProgress: 'Download-Fortschritt',
    initFailed: 'Initialisierung fehlgeschlagen',
    initFailedTip: 'FFmpeg-Engine konnte nicht geladen werden. Bitte überprüfen Sie Ihre Netzwerkverbindung oder verwenden Sie einen modernen Browser mit SharedArrayBuffer-Unterstützung.',
    retryInit: 'Wiederholen',
    welcomeBack: 'Willkommen zurück',
    needInitTip: 'Die FFmpeg-Engine muss zur Verwendung neu geladen werden. Aufgrund von Browsersicherheitsbeschränkungen erfordert das Neuladen der Seite eine Neuinitialisierung.',
    startEngine: 'Engine starten',
    loadingTimeHint: 'Die Ladezeit hängt von der Netzwerkgeschwindigkeit ab, normalerweise einige Sekunden',
  },
  uploader: {
    dragTitle: 'Dateien hierher ziehen',
    dragSubtitle: 'oder klicken, um Dateien auszuwählen',
    dragHint: 'Unterstützt MP4, WebM, MOV, MP3, WAV und mehr. Massen-Upload unterstützt',
    uploadedFiles: 'Hochgeladene Dateien',
    clearAll: 'Alle löschen',
    filesCount: 'Dateien',
    processing: 'In Bearbeitung',
    completed: 'Abgeschlossen',
    failed: 'Fehlgeschlagen',
    pending: 'Ausstehend',
  },
  editor: {
    title: 'Befehls-Editor',
    executing: 'Wird ausgeführt...',
    execute: 'Befehl ausführen',
    executeBatch: 'Massenausführung',
    reset: 'Zurücksetzen',
    noFile: 'Bitte zuerst eine Datei hochladen',
    tipTitle: 'Tipp: ',
    tipContent: 'Verwenden Sie input als Platzhalter für den Eingabedateinamen. Er wird automatisch durch Ihren hochgeladenen Dateinamen ersetzt. Verwenden Sie output.mp4 als Ausgabedateinamen.',
    batchMode: 'Massenmodus',
    singleMode: 'Einzelmodus',
    segmentsTitle: 'Befehlsanalyse',
    editableLabel: 'Bearbeitbar',
    currentFile: 'Aktuelle Datei',
    batchProgress: 'Massenfortschritt',
    complexLabel: 'Erweiterter Befehl',
    wasmWarningLabel: 'WASM-Einschränkung',
    wasmWarningText: 'Diese Funktion kann in der Browser-WASM-Umgebung eingeschränkt sein',
    usageHintLabel: 'Verwendungshinweis',
    simplifiedLabel: 'Vereinfacht',
    switchToFull: 'Zu vollständig wechseln',
    switchToSimplified: 'Zu vereinfachter wechseln',
  },
  logs: {
    title: 'Ausführungsprotokoll',
    clear: 'Löschen',
    empty: 'Keine Protokolle',
    emptyHint: 'Protokolle werden nach der Befehlsausführung angezeigt',
    scrollBottom: 'Nach unten scrollen',
    prefixOk: '[OK]',
    prefixErr: '[ERR]',
    prefixWarn: '[WARN]',
    prefixInfo: '[INFO]',
    batchStart: 'Massenverarbeitung gestartet',
    batchComplete: 'Massenverarbeitung abgeschlossen',
    batchFailed: 'Massenverarbeitung teilweise fehlgeschlagen',
    fileStart: 'Dateiverarbeitung gestartet',
    fileComplete: 'Dateiverarbeitung abgeschlossen',
    fileFailed: 'Dateiverarbeitung fehlgeschlagen',
  },
  output: {
    title: 'Ausgabedateien',
    empty: 'Keine Ausgabedateien',
    emptyHint: 'Ergebnisse werden nach der Befehlsausführung angezeigt',
    download: 'Datei herunterladen',
    downloadAll: 'Alle herunterladen',
    remove: 'Entfernen',
    sourceFile: ' Quelldatei',
  },
  history: {
    title: 'Verlauf',
    empty: 'Kein Verlauf',
    emptyHint: 'Befehle werden nach der Ausführung gespeichert',
    inputs: 'Eingänge',
    outputs: 'Ausgänge',
    copy: 'Befehl kopieren',
    use: 'Diesen Befehl verwenden',
    batch: 'Massenaufgabe',
    totalTime: 'Gesamtzeit',
  },
  status: {
    idle: 'Warten auf Initialisierung',
    loading: 'Engine wird geladen...',
    ready: 'Bereit',
    executing: 'Wird ausgeführt...',
    error: 'Fehler',
    processingFile: 'Datei wird verarbeitet',
    batchComplete: 'Massenverarbeitung abgeschlossen',
  },
  presets: {
    title: 'Voreinstellungen',
    searchPlaceholder: 'Voreinstellungen durchsuchen...',
    noResults: 'Keine passenden Voreinstellungen',
    complex: 'Erweitert',
    wasmWarning: 'WASM-Einschränkung',
    categories: {
      all: 'Alle',
      convert: 'Konvertieren',
      audio: 'Audio',
      compress: 'Komprimieren',
      edit: 'Bearbeiten',
      filter: 'Filter',
      extract: 'Frames extrahieren',
      subtitle: 'Untertitel',
      watermark: 'Wasserzeichen',
      gif: 'GIF',
      stream: 'Streaming',
      advanced: 'Erweitert',
      diagnose: 'Diagnose',
    },
  },
}

const fr: TranslationKeys = {
  app: {
    title: 'PTVD',
    subtitle: 'Prism Technology Video Do',
    browserWarning: 'Nécessite un navigateur moderne avec prise en charge de SharedArrayBuffer',
    about: 'À propos',
    tips: 'Conseils',
    tip1: 'Lors de la première utilisation, le moteur FFmpeg.wasm est chargé (~30 Mo)',
    tip2: 'Les fichiers volumineux sont limités par la mémoire du navigateur, < 500 Mo recommandé',
    tip3: 'Utilisez input comme espace réservé pour le fichier d\'entrée',
    tip4: 'Tout le traitement se fait localement dans le navigateur, les fichiers ne sont pas téléchargés',
    footer: '©2026PTStudio',
    loadingFFmpeg: 'Chargement du moteur FFmpeg',
    loadingTip: 'Lors de la première utilisation, ~30 Mo de fichiers moteur doivent être téléchargés. Veuillez patienter.',
    loadingProgress: 'Progression du téléchargement',
    initFailed: 'Échec de l\'initialisation',
    initFailedTip: 'Impossible de charger le moteur FFmpeg. Veuillez vérifier votre connexion réseau ou utiliser un navigateur moderne avec prise en charge de SharedArrayBuffer.',
    retryInit: 'Réessayer',
    welcomeBack: 'Bon retour',
    needInitTip: 'Le moteur FFmpeg doit être rechargé pour fonctionner. En raison des restrictions de sécurité du navigateur, le rechargement de la page nécessite une réinitialisation.',
    startEngine: 'Démarrer le moteur',
    loadingTimeHint: 'Le temps de chargement dépend de la vitesse du réseau, prend généralement quelques secondes',
  },
  uploader: {
    dragTitle: 'Glissez les fichiers ici',
    dragSubtitle: 'ou cliquez pour sélectionner',
    dragHint: 'Prend en charge MP4, WebM, MOV, MP3, WAV et plus. Téléversement par lot pris en charge',
    uploadedFiles: 'Fichiers téléchargés',
    clearAll: 'Tout effacer',
    filesCount: 'fichiers',
    processing: 'Traitement',
    completed: 'Terminé',
    failed: 'Échoué',
    pending: 'En attente',
  },
  editor: {
    title: 'Éditeur de commandes',
    executing: 'Exécution...',
    execute: 'Exécuter la commande',
    executeBatch: 'Exécuter par lot',
    reset: 'Réinitialiser',
    noFile: 'Veuillez d\'abord télécharger un fichier',
    tipTitle: 'Astuce : ',
    tipContent: 'Utilisez input comme espace réservé pour le nom du fichier d\'entrée — il sera automatiquement remplacé par le nom de votre fichier téléchargé. Utilisez output.mp4 comme nom de fichier de sortie.',
    batchMode: 'Mode lot',
    singleMode: 'Mode unique',
    segmentsTitle: 'Analyse de la commande',
    editableLabel: 'Modifiable',
    currentFile: 'Fichier actuel',
    batchProgress: 'Progression du lot',
    complexLabel: 'Commande avancée',
    wasmWarningLabel: 'Limitation WASM',
    wasmWarningText: 'Cette fonctionnalité peut être limitée dans l\'environnement WASM du navigateur',
    usageHintLabel: 'Conseil d\'utilisation',
    simplifiedLabel: 'Simplifié',
    switchToFull: 'Passer à la version complète',
    switchToSimplified: 'Passer à la version simplifiée',
  },
  logs: {
    title: 'Journal d\'exécution',
    clear: 'Effacer',
    empty: 'Aucun journal',
    emptyHint: 'Les journaux s\'afficheront après l\'exécution de la commande',
    scrollBottom: 'Faire défiler vers le bas',
    prefixOk: '[OK]',
    prefixErr: '[ERR]',
    prefixWarn: '[WARN]',
    prefixInfo: '[INFO]',
    batchStart: 'Traitement par lot démarré',
    batchComplete: 'Traitement par lot terminé',
    batchFailed: 'Traitement par lot partiellement échoué',
    fileStart: 'Traitement du fichier démarré',
    fileComplete: 'Traitement du fichier terminé',
    fileFailed: 'Traitement du fichier échoué',
  },
  output: {
    title: 'Fichiers de sortie',
    empty: 'Aucun fichier de sortie',
    emptyHint: 'Les résultats s\'afficheront après l\'exécution de la commande',
    download: 'Télécharger le fichier',
    downloadAll: 'Tout télécharger',
    remove: 'Supprimer',
    sourceFile: 'Fichier source',
  },
  history: {
    title: 'Historique',
    empty: 'Aucun historique',
    emptyHint: 'Les commandes seront enregistrées après exécution',
    inputs: 'entrées',
    outputs: 'sorties',
    copy: 'Copier la commande',
    use: 'Utiliser cette commande',
    batch: 'Tâche par lot',
    totalTime: 'Temps total',
  },
  status: {
    idle: 'Attente d\'initialisation',
    loading: 'Chargement du moteur...',
    ready: 'Prêt',
    executing: 'Exécution...',
    error: 'Erreur',
    processingFile: 'Traitement du fichier',
    batchComplete: 'Traitement par lot terminé',
  },
  presets: {
    title: 'Modèles prédéfinis',
    searchPlaceholder: 'Rechercher des modèles...',
    noResults: 'Aucun modèle correspondant',
    complex: 'Avancé',
    wasmWarning: 'Limitation WASM',
    categories: {
      all: 'Tous',
      convert: 'Conversion',
      audio: 'Audio',
      compress: 'Compression',
      edit: 'Édition',
      filter: 'Filtres',
      extract: 'Extraire les images',
      subtitle: 'Sous-titres',
      watermark: 'Filigrane',
      gif: 'GIF',
      stream: 'Streaming',
      advanced: 'Avancé',
      diagnose: 'Diagnostic',
    },
  },
}

export const translations: Record<LanguageCode, TranslationKeys> = { zh, en, ja, ru, de, fr }
