import { LanguageCode } from '../i18n/translations'

export interface CommandSegment {
  text: string
  description: string
  editable: boolean
  type: 'keyword' | 'option' | 'value' | 'input' | 'output' | 'filter' | 'separator'
}

type LangDescriptions = Record<LanguageCode, string>

const optionDescriptions: Record<string, LangDescriptions> = {
  'ffmpeg': {
    zh: 'FFmpeg 命令行工具',
    en: 'FFmpeg command-line tool',
    ja: 'FFmpeg コマンドラインツール',
    ru: 'Командная строка FFmpeg',
    de: 'FFmpeg Befehlszeilentool',
    fr: 'Outil en ligne de commande FFmpeg',
  },
  'ffprobe': {
    zh: 'FFprobe 媒体分析工具',
    en: 'FFprobe media analysis tool',
    ja: 'FFprobe メディア分析ツール',
    ru: 'Инструмент анализа медиа FFprobe',
    de: 'FFprobe Medienanalyse-Tool',
    fr: 'Outil d\'analyse média FFprobe',
  },
  '-i': {
    zh: '指定输入文件',
    en: 'Specify input file',
    ja: '入力ファイルを指定',
    ru: 'Указать входной файл',
    de: 'Eingabedatei angeben',
    fr: 'Spécifier le fichier d\'entrée',
  },
  '-o': {
    zh: '指定输出文件',
    en: 'Specify output file',
    ja: '出力ファイルを指定',
    ru: 'Указать выходной файл',
    de: 'Ausgabedatei angeben',
    fr: 'Spécifier le fichier de sortie',
  },
  '-c:v': {
    zh: '视频编码器',
    en: 'Video codec',
    ja: 'ビデオコーデック',
    ru: 'Видеокодек',
    de: 'Videocodec',
    fr: 'Codec vidéo',
  },
  '-c:a': {
    zh: '音频编码器',
    en: 'Audio codec',
    ja: '音声コーデック',
    ru: 'Аудиокодек',
    de: 'Audiocodec',
    fr: 'Codec audio',
  },
  '-c:s': {
    zh: '字幕编码器',
    en: 'Subtitle codec',
    ja: '字幕コーデック',
    ru: 'Кодек субтитров',
    de: 'Untertitel-Codec',
    fr: 'Codec de sous-titres',
  },
  '-c copy': {
    zh: '直接复制流，不重新编码（速度最快）',
    en: 'Copy stream directly, no re-encoding (fastest)',
    ja: 'ストリームを直接コピー、再エンコードなし（最速）',
    ru: 'Копировать поток напрямую, без перекодирования (самый быстрый)',
    de: 'Stream direkt kopieren, keine Neuverschlüsselung (am schnellsten)',
    fr: 'Copier le flux directement, sans réencodage (le plus rapide)',
  },
  '-vn': {
    zh: '不处理视频流（仅处理音频）',
    en: 'No video stream (audio only)',
    ja: 'ビデオストリームなし（音声のみ）',
    ru: 'Без видеопотока (только аудио)',
    de: 'Kein Videostream (nur Audio)',
    fr: 'Pas de flux vidéo (audio uniquement)',
  },
  '-an': {
    zh: '不处理音频流（仅处理视频）',
    en: 'No audio stream (video only)',
    ja: '音声ストリームなし（ビデオのみ）',
    ru: 'Без аудиопотока (только видео)',
    de: 'Kein Audiostream (nur Video)',
    fr: 'Pas de flux audio (vidéo uniquement)',
  },
  '-preset': {
    zh: '编码预设（影响编码速度和压缩率）',
    en: 'Encoding preset (affects speed and compression)',
    ja: 'エンコーディングプリセット（速度と圧縮率に影響）',
    ru: 'Пресет кодирования (влияет на скорость и сжатие)',
    de: '编码-Preset (beeinflusst Geschwindigkeit und Komprimierung)',
    fr: 'Préset d\'encodage (affecte la vitesse et la compression)',
  },
  '-crf': {
    zh: '恒定质量因子（数值越小质量越高，0-51）',
    en: 'Constant rate factor (lower = higher quality, 0-51)',
    ja: '固定品質係数（数値が小さいほど高品質、0-51）',
    ru: 'Постоянный коэффициент качества (ниже = выше качество, 0-51)',
    de: 'Konstanter Qualitätsfaktor (niedriger = höhere Qualität, 0-51)',
    fr: 'Facteur de qualité constant (plus bas = meilleure qualité, 0-51)',
  },
  '-b:v': {
    zh: '视频目标码率',
    en: 'Target video bitrate',
    ja: 'ターゲットビデオビットレート',
    ru: 'Целевой битрейт видео',
    de: 'Ziel-Videobitrate',
    fr: 'Débit binaire vidéo cible',
  },
  '-b:a': {
    zh: '音频目标码率',
    en: 'Target audio bitrate',
    ja: 'ターゲット音声ビットレート',
    ru: 'Целевой битрейт аудио',
    de: 'Ziel-Audiobitrate',
    fr: 'Débit binaire audio cible',
  },
  '-maxrate': {
    zh: '最大码率',
    en: 'Maximum bitrate',
    ja: '最大ビットレート',
    ru: 'Максимальный битрейт',
    de: 'Maximale Bitrate',
    fr: 'Débit binaire maximum',
  },
  '-bufsize': {
    zh: '缓冲区大小',
    en: 'Buffer size',
    ja: 'バッファサイズ',
    ru: 'Размер буфера',
    de: 'Puffergröße',
    fr: 'Taille du tampon',
  },
  '-r': {
    zh: '设置帧率',
    en: 'Set frame rate',
    ja: 'フレームレートを設定',
    ru: 'Установить частоту кадров',
    de: 'Frame-Rate einstellen',
    fr: 'Définir la fréquence d\'images',
  },
  '-s': {
    zh: '设置分辨率 (宽x高)',
    en: 'Set resolution (width x height)',
    ja: '解像度を設定（幅x高さ）',
    ru: 'Установить разрешение (ширина x высота)',
    de: 'Auflösung einstellen (Breite x Höhe)',
    fr: 'Définir la résolution (largeur x hauteur)',
  },
  '-ar': {
    zh: '音频采样率',
    en: 'Audio sample rate',
    ja: '音声サンプルレート',
    ru: 'Частота дискретизации аудио',
    de: 'Audio-Samplerate',
    fr: 'Taux d\'échantillonnage audio',
  },
  '-ac': {
    zh: '音频声道数 (1=单声道, 2=立体声)',
    en: 'Audio channels (1=mono, 2=stereo)',
    ja: '音声チャンネル数（1=モノラル、2=ステレオ）',
    ru: 'Количество аудиоканалов (1=моно, 2=стерео)',
    de: 'Audio-Kanäle (1=Mono, 2=Stereo)',
    fr: 'Canaux audio (1=mono, 2=stéréo)',
  },
  '-acodec': {
    zh: '音频编码器（旧写法）',
    en: 'Audio codec (legacy syntax)',
    ja: '音声コーデック（旧記法）',
    ru: 'Аудиокодек (устаревший синтаксис)',
    de: 'Audiocodec (alte Syntax)',
    fr: 'Codec audio (ancienne syntaxe)',
  },
  '-ab': {
    zh: '音频码率（旧写法）',
    en: 'Audio bitrate (legacy syntax)',
    ja: '音声ビットレート（旧記法）',
    ru: 'Битрейт аудио (устаревший синтаксис)',
    de: 'Audiobitrate (alte Syntax)',
    fr: 'Débit binaire audio (ancienne syntaxe)',
  },
  '-vf': {
    zh: '视频滤镜',
    en: 'Video filter',
    ja: 'ビデオフィルター',
    ru: 'Видеофильтр',
    de: 'Videofilter',
    fr: 'Filtre vidéo',
  },
  '-af': {
    zh: '音频滤镜',
    en: 'Audio filter',
    ja: '音声フィルター',
    ru: 'Аудиофильтр',
    de: 'Audiofilter',
    fr: 'Filtre audio',
  },
  '-filter_complex': {
    zh: '复杂滤镜（多输入多输出）',
    en: 'Complex filter (multi-input, multi-output)',
    ja: '複雑フィルター（マルチ入力、マルチ出力）',
    ru: 'Сложный фильтр (множественный вход/выход)',
    de: 'Komplexfilter (Mehrfach-Eingang/Ausgang)',
    fr: 'Filtre complexe (multi-entrée, multi-sortie)',
  },
  '-ss': {
    zh: '开始时间 (seek to)',
    en: 'Start time (seek to)',
    ja: '開始時間（シーク）',
    ru: 'Начальное время (переход)',
    de: 'Startzeit (seek)',
    fr: 'Heure de début (recherche)',
  },
  '-t': {
    zh: '持续时长',
    en: 'Duration',
    ja: '持続時間',
    ru: 'Продолжительность',
    de: 'Dauer',
    fr: 'Durée',
  },
  '-f': {
    zh: '容器格式',
    en: 'Container format',
    ja: 'コンテナフォーマット',
    ru: 'Формат контейнера',
    de: 'Containerformat',
    fr: 'Format conteneur',
  },
  '-map': {
    zh: '映射输入流到输出',
    en: 'Map input streams to output',
    ja: '入力ストリームを出力にマッピング',
    ru: 'Сопоставить входные потоки с выходными',
    de: 'Eingabeströme zu Ausgang zuordnen',
    fr: 'Mapper les flux d\'entrée vers la sortie',
  },
  '-map_metadata': {
    zh: '映射元数据',
    en: 'Map metadata',
    ja: 'メタデータをマッピング',
    ru: 'Сопоставить метаданные',
    de: 'Metadaten zuordnen',
    fr: 'Mapper les métadonnées',
  },
  '-vframes': {
    zh: '设置输出帧数',
    en: 'Set number of output frames',
    ja: '出力フレーム数を設定',
    ru: 'Установить количество выходных кадров',
    de: 'Anzahl der Ausgabeframes einstellen',
    fr: 'Définir le nombre de trames de sortie',
  },
  '-movflags': {
    zh: 'MP4/MOV 容器标志',
    en: 'MP4/MOV container flags',
    ja: 'MP4/MOVコンテナフラグ',
    ru: 'Флаги контейнера MP4/MOV',
    de: 'MP4/MOV-Container-Flags',
    fr: 'Drapeaux du conteneur MP4/MOV',
  },
  '-pix_fmt': {
    zh: '像素格式',
    en: 'Pixel format',
    ja: 'ピクセルフォーマット',
    ru: 'Формат пикселей',
    de: 'Pixelformat',
    fr: 'Format de pixel',
  },
  '-stream_loop': {
    zh: '循环输入流次数',
    en: 'Loop input stream N times',
    ja: '入力ストリームをN回ループ',
    ru: 'Зациклить входной поток N раз',
    de: 'Eingabestream N-mal wiederholen',
    fr: 'Boucler le flux d\'entrée N fois',
  },
  '-segment_time': {
    zh: '分段时长',
    en: 'Segment duration',
    ja: 'セグメント時間',
    ru: 'Продолжительность сегмента',
    de: 'Segmentdauer',
    fr: 'Durée du segment',
  },
  '-hls_time': {
    zh: 'HLS 分段时长',
    en: 'HLS segment duration',
    ja: 'HLSセグメント時間',
    ru: 'Продолжительность HLS-сегмента',
    de: 'HLS-Segmentdauer',
    fr: 'Durée du segment HLS',
  },
  '-hls_list_size': {
    zh: 'HLS 播放列表大小',
    en: 'HLS playlist size',
    ja: 'HLSプレイリストサイズ',
    ru: 'Размер HLS-плейлиста',
    de: 'HLS-Playlist-Größe',
    fr: 'Taille de la liste de lecture HLS',
  },
  '-seg_duration': {
    zh: 'DASH 分段时长',
    en: 'DASH segment duration',
    ja: 'DASHセグメント時間',
    ru: 'Продолжительность DASH-сегмента',
    de: 'DASH-Segmentdauer',
    fr: 'Durée du segment DASH',
  },
  '-err_detect': {
    zh: '错误检测方式',
    en: 'Error detection mode',
    ja: 'エラー検出モード',
    ru: 'Режим обнаружения ошибок',
    de: 'Fehlererkennungsmodus',
    fr: 'Mode de détection des erreurs',
  },
  '-f lavfi': {
    zh: '使用 Lavfi 虚拟输入',
    en: 'Use Lavfi virtual input',
    ja: 'Lavfi仮想入力を使用',
    ru: 'Использовать виртуальный вход Lavfi',
    de: 'Lavfi virtuellen Eingang verwenden',
    fr: 'Utiliser l\'entrée virtuelle Lavfi',
  },
  '-safe': {
    zh: '安全模式 (concat demuxer)',
    en: 'Safe mode (concat demuxer)',
    ja: 'セーフモード（concatデマルチプレクサー）',
    ru: 'Безопасный режим (concat демуксер)',
    de: 'Sicheren Modus (Concat-Demuxer)',
    fr: 'Mode sûr (demuxer concat)',
  },
  '-loop': {
    zh: '循环输出次数 (GIF)',
    en: 'Loop output count (GIF)',
    ja: '出力ループ回数（GIF）',
    ru: 'Количество циклов вывода (GIF)',
    de: 'Ausgabe-Loop-Anzahl (GIF)',
    fr: 'Nombre de boucles de sortie (GIF)',
  },
  'libx264': {
    zh: 'H.264 编码器（最常用、兼容性最好）',
    en: 'H.264 encoder (most common, best compatibility)',
    ja: 'H.264エンコーダー（最も一般的、互換性最高）',
    ru: 'Кодер H.264 (самый распространенный, лучшая совместимость)',
    de: 'H.264-Encoder (häufigster, beste Kompatibilität)',
    fr: 'Codec H.264 (le plus courant, meilleure compatibilité)',
  },
  'libx265': {
    zh: 'H.265/HEVC 编码器（体积更小）',
    en: 'H.265/HEVC encoder (smaller size)',
    ja: 'H.265/HEVCエンコーダー（より小さいサイズ）',
    ru: 'Кодер H.265/HEVC (меньший размер)',
    de: 'H.265/HEVC-Encoder (kleinere Größe)',
    fr: 'Codec H.265/HEVC (taille plus petite)',
  },
  'libvpx': {
    zh: 'VP8 视频编码器',
    en: 'VP8 video encoder',
    ja: 'VP8ビデオコーデック',
    ru: 'Видеокодер VP8',
    de: 'VP8-Videocodec',
    fr: 'Codec vidéo VP8',
  },
  'libvpx-vp9': {
    zh: 'VP9 视频编码器',
    en: 'VP9 video encoder',
    ja: 'VP9ビデオコーデック',
    ru: 'Видеокодер VP9',
    de: 'VP9-Videocodec',
    fr: 'Codec vidéo VP9',
  },
  'libtheora': {
    zh: 'Theora 视频编码器',
    en: 'Theora video encoder',
    ja: 'Theoraビデオコーデック',
    ru: 'Видеокодер Theora',
    de: 'Theora-Videocodec',
    fr: 'Codec vidéo Theora',
  },
  'mpeg4': {
    zh: 'MPEG-4 视频编码器',
    en: 'MPEG-4 video encoder',
    ja: 'MPEG-4ビデオコーデック',
    ru: 'Видеокодер MPEG-4',
    de: 'MPEG-4-Videocodec',
    fr: 'Codec vidéo MPEG-4',
  },
  'wmv2': {
    zh: 'Windows Media Video 编码器',
    en: 'Windows Media Video encoder',
    ja: 'Windows Media Videoコーデック',
    ru: 'Кодер Windows Media Video',
    de: 'Windows Media Video-Encoder',
    fr: 'Codec Windows Media Video',
  },
  'h264_nvenc': {
    zh: 'NVIDIA NVENC 硬件加速编码器',
    en: 'NVIDIA NVENC hardware encoder',
    ja: 'NVIDIA NVENCハードウェアエンコーダー',
    ru: 'Аппаратный кодер NVIDIA NVENC',
    de: 'NVIDIA NVENC Hardware-Encoder',
    fr: 'Codec matériel NVIDIA NVENC',
  },
  'aac': {
    zh: 'AAC 音频编码器',
    en: 'AAC audio encoder',
    ja: 'AAC音声コーデック',
    ru: 'Аудиокодер AAC',
    de: 'AAC-Audiocodec',
    fr: 'Codec audio AAC',
  },
  'libmp3lame': {
    zh: 'MP3 音频编码器',
    en: 'MP3 audio encoder',
    ja: 'MP3音声コーデック',
    ru: 'MP3 аудиокодер',
    de: 'MP3-Audiocodec',
    fr: 'Codec audio MP3',
  },
  'libvorbis': {
    zh: 'Vorbis 音频编码器',
    en: 'Vorbis audio encoder',
    ja: 'Vorbis音声コーデック',
    ru: 'Аудиокодер Vorbis',
    de: 'Vorbis-Audiocodec',
    fr: 'Codec audio Vorbis',
  },
  'libopus': {
    zh: 'Opus 音频编码器',
    en: 'Opus audio encoder',
    ja: 'Opus音声コーデック',
    ru: 'Аудиокодер Opus',
    de: 'Opus-Audiocodec',
    fr: 'Codec audio Opus',
  },
  'flac': {
    zh: 'FLAC 无损音频编码器',
    en: 'FLAC lossless audio encoder',
    ja: 'FLACロスレス音声コーデック',
    ru: 'FLAC без потерь аудиокодер',
    de: 'FLAC Verlustfrei-Audiocodec',
    fr: 'Codec audio sans perte FLAC',
  },
  'pcm_s16le': {
    zh: 'PCM 16位有符号小端 (WAV)',
    en: 'PCM 16-bit signed little-endian (WAV)',
    ja: 'PCM 16ビット符号付きリトルエンディアン（WAV）',
    ru: 'PCM 16-битный знаковый little-endian (WAV)',
    de: 'PCM 16-bit signiert little-endian (WAV)',
    fr: 'PCM 16 bits signé little-endian (WAV)',
  },
  'wmav2': {
    zh: 'Windows Media Audio 编码器',
    en: 'Windows Media Audio encoder',
    ja: 'Windows Media Audioコーデック',
    ru: 'Кодер Windows Media Audio',
    de: 'Windows Media Audio-Encoder',
    fr: 'Codec Windows Media Audio',
  },
  'mp3': {
    zh: 'MP3 音频格式',
    en: 'MP3 audio format',
    ja: 'MP3音声フォーマット',
    ru: 'MP3 аудио формат',
    de: 'MP3 Audioformat',
    fr: 'Format audio MP3',
  },
  'ultrafast': {
    zh: '最快编码预设（压缩率最低）',
    en: 'Fastest encoding preset (lowest compression)',
    ja: '最速エンコーディングプリセット（最低圧縮率）',
    ru: 'Самый быстрый пресет кодирования (самое низкое сжатие)',
    de: 'Schnellster Encoding-Preset (niedrigste Komprimierung)',
    fr: 'Preset d\'encodage le plus rapide (compression la plus faible)',
  },
  'fast': {
    zh: '快速编码预设',
    en: 'Fast encoding preset',
    ja: '高速エンコーディングプリセット',
    ru: 'Быстрый пресет кодирования',
    de: 'Schneller Encoding-Preset',
    fr: 'Preset d\'encodage rapide',
  },
  'medium': {
    zh: '中等编码预设（默认）',
    en: 'Medium encoding preset (default)',
    ja: '中等エンコーディングプリセット（デフォルト）',
    ru: 'Средний пресет кодирования (по умолчанию)',
    de: 'Mittlerer Encoding-Preset (Standard)',
    fr: 'Preset d\'encodage moyen (par défaut)',
  },
  'slow': {
    zh: '慢速编码预设（压缩率最高）',
    en: 'Slow encoding preset (highest compression)',
    ja: '低速エンコーディングプリセット（最高圧縮率）',
    ru: 'Медленный пресет кодирования (самое высокое сжатие)',
    de: 'Langsamer Encoding-Preset (höchste Komprimierung)',
    fr: 'Preset d\'encodage lent (compression la plus élevée)',
  },
  'p4': {
    zh: 'NVENC 性能预设 (P4)',
    en: 'NVENC performance preset (P4)',
    ja: 'NVENCパフォーマンスプリセット（P4）',
    ru: 'Пресет производительности NVENC (P4)',
    de: 'NVENC Performance-Preset (P4)',
    fr: 'Preset performance NVENC (P4)',
  },
  '+faststart': {
    zh: 'MP4 网页优化（moov atom 前置）',
    en: 'MP4 web optimization (moov atom first)',
    ja: 'MP4ウェブ最適化（moov atom先頭）',
    ru: 'MP4 веб-оптимизация (moov atom первым)',
    de: 'MP4 Web-Optimierung (moov atom zuerst)',
    fr: 'Optimisation web MP4 (atome moov en premier)',
  },
  'yuv420p': {
    zh: 'YUV 4:2:0 像素格式（兼容性最好）',
    en: 'YUV 4:2:0 pixel format (best compatibility)',
    ja: 'YUV 4:2:0ピクセルフォーマット（互換性最高）',
    ru: 'Формат пикселей YUV 4:2:0 (лучшая совместимость)',
    de: 'YUV 4:2:0 Pixelformat (beste Kompatibilität)',
    fr: 'Format de pixel YUV 4:2:0 (meilleure compatibilité)',
  },
  'ignore_err': {
    zh: '忽略错误继续处理',
    en: 'Ignore errors and continue',
    ja: 'エラーを無視して続行',
    ru: 'Игнорировать ошибки и продолжать',
    de: 'Fehler ignorieren und fortsetzen',
    fr: 'Ignorer les erreurs et continuer',
  },
  'require-corp': {
    zh: '跨域嵌入策略',
    en: 'Cross-origin embedder policy',
    ja: 'クロスオリジン埋め込みポリシー',
    ru: 'Политика встраивания между источниками',
    de: 'Cross-Origin-Embedder-Policy',
    fr: 'Politique d\'intégration multi-origine',
  },
  'input': {
    zh: '输入文件占位符（执行时自动替换）',
    en: 'Input file placeholder (auto-replaced on execution)',
    ja: '入力ファイルプレースホルダー（実行時に自動置換）',
    ru: 'Плейсхолдер входного файла (автозамена при выполнении)',
    de: 'Eingabedatei-Platzhalter (automatische Ersetzung bei Ausführung)',
    fr: 'Espacé réservé du fichier d\'entrée (remplacé automatiquement lors de l\'exécution)',
  },
  'output': {
    zh: '输出文件名前缀',
    en: 'Output filename prefix',
    ja: '出力ファイル名プレフィックス',
    ru: 'Префикс имени выходного файла',
    de: 'Ausgabedateiname-Präfix',
    fr: 'Préfixe du nom du fichier de sortie',
  },
  'filelist.txt': {
    zh: '文件列表（用于拼接）',
    en: 'File list (for concatenation)',
    ja: 'ファイルリスト（結合用）',
    ru: 'Список файлов (для объединения)',
    de: 'Dateiliste (zum Zusammenfügen)',
    fr: 'Liste de fichiers (pour la concaténation)',
  },
  'subtitle.srt': {
    zh: '字幕文件 (SRT 格式)',
    en: 'Subtitle file (SRT format)',
    ja: '字幕ファイル（SRT形式）',
    ru: 'Файл субтитров (формат SRT)',
    de: 'Untertiteldatei (SRT-Format)',
    fr: 'Fichier de sous-titres (format SRT)',
  },
  'subtitle.ass': {
    zh: '字幕文件 (ASS 格式)',
    en: 'Subtitle file (ASS format)',
    ja: '字幕ファイル（ASS形式）',
    ru: 'Файл субтитров (формат ASS)',
    de: 'Untertiteldatei (ASS-Format)',
    fr: 'Fichier de sous-titres (format ASS)',
  },
  'logo.png': {
    zh: 'Logo/水印图片',
    en: 'Logo/watermark image',
    ja: 'ロゴ/ウォーターマーク画像',
    ru: 'Логотип/водяной знак',
    de: 'Logo/Wasserzeichen-Bild',
    fr: 'Image logo/marque déposée',
  },
  'audio.mp3': {
    zh: '音频文件 (MP3)',
    en: 'Audio file (MP3)',
    ja: '音声ファイル（MP3）',
    ru: 'Аудиофайл (MP3)',
    de: 'Audio-Datei (MP3)',
    fr: 'Fichier audio (MP3)',
  },
  'audio2.mp3': {
    zh: '第二个音频文件',
    en: 'Second audio file',
    ja: '2番目の音声ファイル',
    ru: 'Второй аудиофайл',
    de: 'Zweite Audiodatei',
    fr: 'Deuxième fichier audio',
  },
  'pip.mp4': {
    zh: '画中画视频文件',
    en: 'Picture-in-picture video file',
    ja: 'ピクチャインピクチャビデオファイル',
    ru: 'Видеофайл картинки-в-картинке',
    de: 'Bild-im-Bild-Videodatei',
    fr: 'Fichier vidéo image dans l\'image',
  },
  'rtmp://server/live/key': {
    zh: 'RTMP 直播推流地址',
    en: 'RTMP live stream URL',
    ja: 'RTMPライブストリームURL',
    ru: 'URL RTMP живого потока',
    de: 'RTMP-Live-Stream-URL',
    fr: 'URL de flux en direct RTMP',
  },
}

const genericDescriptions: Record<string, LangDescriptions> = {
  'output_file': {
    zh: '输出文件（可修改文件名和扩展名）',
    en: 'Output file (edit filename and extension)',
    ja: '出力ファイル（ファイル名と拡張子を変更可能）',
    ru: 'Выходной файл (редактируйте имя и расширение)',
    de: 'Ausgabedatei (Dateiname und Erweiterung bearbeiten)',
    fr: 'Fichier de sortie (modifier le nom et l\'extension)',
  },
  'filter_value': {
    zh: '滤镜参数（可调整数值）',
    en: 'Filter parameter (adjustable value)',
    ja: 'フィルターパラメータ（調整可能）',
    ru: 'Параметр фильтра (регулируемое значение)',
    de: 'Filterparameter (einstellbarer Wert)',
    fr: 'Paramètre de filtre (valeur réglable)',
  },
  'time_value': {
    zh: '时间值 (HH:MM:SS)',
    en: 'Time value (HH:MM:SS)',
    ja: '時間値（HH:MM:SS）',
    ru: 'Значение времени (HH:MM:SS)',
    de: 'Zeitwert (HH:MM:SS)',
    fr: 'Valeur temporelle (HH:MM:SS)',
  },
  'resolution': {
    zh: '分辨率（可修改为其他值）',
    en: 'Resolution (change to other values)',
    ja: '解像度（他の値に変更可能）',
    ru: 'Разрешение (измените на другие значения)',
    de: 'Auflösung (auf andere Werte ändern)',
    fr: 'Résolution (changer pour d\'autres valeurs)',
  },
  'fps_value': {
    zh: '帧率（可修改）',
    en: 'Frame rate (editable)',
    ja: 'フレームレート（変更可能）',
    ru: 'Частота кадров (редактируемо)',
    de: 'Frame-Rate (bearbeitbar)',
    fr: 'Fréquence d\'images (modifiable)',
  },
  'bitrate': {
    zh: '码率（可修改）',
    en: 'Bitrate (editable)',
    ja: 'ビットレート（変更可能）',
    ru: 'Битрейт (редактируемо)',
    de: 'Bitrate (bearbeitbar)',
    fr: 'Débit binaire (modifiable)',
  },
  'numeric': {
    zh: '数值参数（可修改）',
    en: 'Numeric parameter (editable)',
    ja: '数値パラメータ（変更可能）',
    ru: 'Числовой параметр (редактируемо)',
    de: 'Numerischer Parameter (bearbeitbar)',
    fr: 'Paramètre numérique (modifiable)',
  },
  'extension': {
    zh: '文件扩展名（决定输出格式）',
    en: 'File extension (determines output format)',
    ja: 'ファイル拡張子（出力形式を決定）',
    ru: 'Расширение файла (определяет формат вывода)',
    de: 'Dateierweiterung (bestimmt Ausgabeformat)',
    fr: 'Extension de fichier (détermine le format de sortie)',
  },
  'separator': {
    zh: '命令分隔符',
    en: 'Command separator',
    ja: 'コマンド区切り文字',
    ru: 'Разделитель команд',
    de: 'Befehlstrenner',
    fr: 'Séparateur de commande',
  },
  'filter_expr': {
    zh: '滤镜表达式（可修改参数）',
    en: 'Filter expression (editable parameters)',
    ja: 'フィルター式（パラメータ変更可能）',
    ru: 'Выражение фильтра (редактируемые параметры)',
    de: 'Filterausdruck (bearbeitbare Parameter)',
    fr: 'Expression de filtre (paramètres modifiables)',
  },
}

function getDesc(key: string, lang: LanguageCode): string | null {
  if (optionDescriptions[key]) {
    return optionDescriptions[key][lang]
  }
  return null
}

function getGenericDesc(type: string, lang: LanguageCode): string | null {
  if (genericDescriptions[type]) {
    return genericDescriptions[type][lang]
  }
  return null
}

function isOutputFile(token: string): boolean {
  if (token === 'input' || token === '-i') return false
  if (token.startsWith('output')) return true
  if (token === 'frame_%03d.png' || token === 'thumbnail.jpg') return true
  if (token === 'preview.gif') return true
  if (token === 'contact_sheet.jpg') return true
  if (token === 'output.gif') return true
  if (token === 'output.m3u8') return true
  if (token === 'output.mpd') return true
  if (token === 'output.srt') return true
  if (token === 'output.wav') return true
  if (token === 'output.opus') return true
  if (token === 'output.ogg') return true
  if (token === 'output.flac') return true
  if (token === 'output.m4a') return true
  if (token === 'frame_%03d.png') return true
  if (token === 'output_%03d.mp4') return true
  return /\.(mp4|mkv|webm|mov|avi|flv|wmv|3gp|ts|mp3|wav|ogg|flac|opus|m4a|gif|jpg|png|srt|ogv)$/i.test(token) && !token.startsWith('-')
}

function isInputFile(token: string): boolean {
  return token === 'input' || token === '"input"'
}

function isFilterArg(token: string): boolean {
  return (token.startsWith('"') && token.endsWith('"')) ||
    (token.startsWith("'") && token.endsWith("'"))
}

function isTimeFormat(token: string): boolean {
  return /^\d{2}:\d{2}:\d{2}$/.test(token) || /^\d{2}:\d{2}$/.test(token)
}

function isNumeric(token: string): boolean {
  return /^\d+[kKmMpP]?$/.test(token) || /^\d+\.\d+$/.test(token)
}

export function parseCommandSegments(command: string, lang: LanguageCode): CommandSegment[] {
  const segments: CommandSegment[] = []

  const tokens = tokenizeCommand(command)

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    if (!token.trim()) {
      segments.push({
        text: token,
        description: getGenericDesc('separator', lang)!,
        editable: false,
        type: 'separator',
      })
      continue
    }

    if (isInputFile(token)) {
      segments.push({
        text: token,
        description: getDesc('input', lang) || token,
        editable: true,
        type: 'input',
      })
      continue
    }

    if (token === 'ffmpeg' || token === 'ffprobe') {
      segments.push({
        text: token,
        description: getDesc(token, lang) || token,
        editable: false,
        type: 'keyword',
      })
      continue
    }

    const combinedToken = i + 1 < tokens.length ? `${token} ${tokens[i + 1]}` : token
    const combinedDesc = getDesc(combinedToken, lang)
    if (combinedDesc) {
      segments.push({
        text: combinedToken,
        description: combinedDesc,
        editable: false,
        type: 'option',
      })
      i++
      continue
    }

    if (getDesc(token, lang)) {
      segments.push({
        text: token,
        description: getDesc(token, lang)!,
        editable: false,
        type: 'option',
      })
      continue
    }

    if (token.startsWith('-')) {
      segments.push({
        text: token,
        description: token,
        editable: false,
        type: 'option',
      })
      continue
    }

    if (isOutputFile(token)) {
      const ext = token.includes('.') ? token.split('.').pop() : ''
      segments.push({
        text: token,
        description: getGenericDesc('output_file', lang) + (ext ? ` (.${ext})` : ''),
        editable: true,
        type: 'output',
      })
      continue
    }

    if (isFilterArg(token)) {
      const desc = getGenericDesc('filter_expr', lang) || ''
      segments.push({
        text: token,
        description: desc,
        editable: true,
        type: 'filter',
      })
      continue
    }

    if (isTimeFormat(token)) {
      segments.push({
        text: token,
        description: getGenericDesc('time_value', lang) || '',
        editable: true,
        type: 'value',
      })
      continue
    }

    if (isNumeric(token)) {
      const prevToken = i > 0 ? tokens[i - 1] : ''
      let desc = getGenericDesc('numeric', lang) || ''
      if (prevToken === '-r') desc = getGenericDesc('fps_value', lang) || ''
      else if (prevToken === '-b:v' || prevToken === '-b:a') desc = getGenericDesc('bitrate', lang) || ''
      else if (prevToken === '-s' || prevToken === 'scale=') desc = getGenericDesc('resolution', lang) || ''

      segments.push({
        text: token,
        description: desc,
        editable: true,
        type: 'value',
      })
      continue
    }

    segments.push({
      text: token,
      description: token,
      editable: true,
      type: 'value',
    })
  }

  return segments
}

function tokenizeCommand(command: string): string[] {
  const tokens: string[] = []
  let current = ''
  let inSingleQuote = false
  let inDoubleQuote = false

  for (let i = 0; i < command.length; i++) {
    const ch = command[i]

    if (ch === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote
      current += ch
    } else if (ch === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote
      current += ch
    } else if (ch === ' ' && !inSingleQuote && !inDoubleQuote) {
      if (current) tokens.push(current)
      current = ''
      tokens.push(' ')
    } else {
      current += ch
    }
  }

  if (current) tokens.push(current)
  return tokens.filter(t => t !== '')
}
