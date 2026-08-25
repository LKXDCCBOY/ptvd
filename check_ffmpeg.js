const fs = require('fs');
const content = fs.readFileSync('public/ffmpeg.js', 'utf8');

// 查找 core.js 和 wasm 引用
const coreRefs = [];
const wasmRefs = [];
let idx = 0;

while ((idx = content.indexOf('core.js', idx)) !== -1) {
  coreRefs.push({
    position: idx,
    context: content.substring(Math.max(0, idx - 30), idx + 40)
  });
  idx += 1;
}

idx = 0;
while ((idx = content.indexOf('.wasm', idx)) !== -1) {
  wasmRefs.push({
    position: idx,
    context: content.substring(Math.max(0, idx - 30), idx + 40)
  });
  idx += 1;
}

console.log('core.js references:', JSON.stringify(coreRefs, null, 2));
console.log('\nwasm references:', JSON.stringify(wasmRefs, null, 2));
