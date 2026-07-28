import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD_FILE = path.join(__dirname, '..', 'dist', 'index.html');
const MAX_BYTES = 5 * 1024 * 1024;

if (!fs.existsSync(BUILD_FILE)) {
  console.error('size-check: dist/index.html not found. Run npm run build first.');
  process.exit(1);
}

const stats = fs.statSync(BUILD_FILE);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
const limitMB = (MAX_BYTES / (1024 * 1024)).toFixed(0);

console.log(`Built file size: ${sizeMB} MB (${stats.size.toLocaleString()} bytes)`);
console.log(`Limit: ${limitMB} MB`);

if (stats.size > MAX_BYTES) {
  console.error(`FAIL: dist/index.html exceeds ${limitMB} MB limit.`);
  process.exit(1);
}

console.log('PASS: File size is within limit.');
