const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 4173;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// Simple SPA static server
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, reqPath === '/' ? 'index.html' : reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (err) {
    res.writeHead(500);
    res.end('Error loading file');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  try {
    // 1. Gambar1.png: Halaman Utama
    console.log('Capturing Gambar1.png (Halaman Utama)...');
    execSync(`"${edgePath}" --headless --disable-gpu --window-size=1280,900 --screenshot="Gambar1.png" http://127.0.0.1:${PORT}/`, { stdio: 'inherit' });

    // 2. Gambar3.png: Halaman Statistik
    console.log('Capturing Gambar3.png (Halaman Statistik)...');
    execSync(`"${edgePath}" --headless --disable-gpu --window-size=1280,900 --screenshot="Gambar3.png" http://127.0.0.1:${PORT}/stats`, { stdio: 'inherit' });

    console.log('Screenshots generated successfully!');
  } catch (e) {
    console.error('Failed to capture:', e);
  } finally {
    server.close();
    process.exit(0);
  }
});

