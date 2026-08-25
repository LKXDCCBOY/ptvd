// Cloudflare Pages Function: 为所有响应添加 COOP/COEP 安全头
// 确保 SharedArrayBuffer 可用，FFmpeg.wasm 正常运行

export async function onRequest(context) {
  const request = context.request;
  const response = await context.next();

  // 克隆响应以修改头部
  const newResponse = new Response(response.body, response);

  // 跨域隔离必需的两个头
  newResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  newResponse.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

  // 安全加固
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');

  return newResponse;
}
