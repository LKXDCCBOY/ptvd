const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const assetsDir = path.join(distDir, 'assets');

const filesToCopy = [
  {
    src: path.join(__dirname, '..', 'node_modules', '@ffmpeg', 'ffmpeg', 'dist', 'esm', 'const.js'),
    dest: path.join(assetsDir, 'const.js'),
  },
  {
    src: path.join(__dirname, '..', 'node_modules', '@ffmpeg', 'ffmpeg', 'dist', 'esm', 'errors.js'),
    dest: path.join(assetsDir, 'errors.js'),
  },
];

for (const { src, dest } of filesToCopy) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${path.basename(src)} -> ${path.relative(distDir, dest)}`);
  } else {
    console.warn(`Warning: Source file not found: ${src}`);
  }
}

// 复制 Cloudflare Functions 到 dist/functions/
const functionsSrcDir = path.join(__dirname, '..', 'functions');
const functionsDestDir = path.join(distDir, 'functions');

if (fs.existsSync(functionsSrcDir)) {
  if (!fs.existsSync(functionsDestDir)) {
    fs.mkdirSync(functionsDestDir, { recursive: true });
  }
  
  const functionFiles = fs.readdirSync(functionsSrcDir);
  for (const file of functionFiles) {
    const src = path.join(functionsSrcDir, file);
    const dest = path.join(functionsDestDir, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
      console.log(`Copied Function: ${file} -> functions/${file}`);
    }
  }
  console.log('Cloudflare Functions copied successfully.');
}

console.log('Worker dependencies copied successfully.');
