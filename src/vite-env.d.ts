/// <reference types="vite/client" />

declare module '*?url' {
  const src: string
  export default src
}

declare module '@ffmpeg/core?url' {
  const src: string
  export default src
}

declare module '@ffmpeg/core/wasm?url' {
  const src: string
  export default src
}

declare module '@ffmpeg/ffmpeg/worker?url' {
  const src: string
  export default src
}
