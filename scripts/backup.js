import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const backupsDir = path.join(rootDir, 'backups');
const stagingDir = path.join(backupsDir, 'staging');

if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

// Clean staging dir
if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

// Items to copy (clean code without node_modules)
const itemsToCopy = [
  'server',
  'client/src',
  'client/public',
  'client/index.html',
  'client/vite.config.js',
  'client/package.json',
  'tests',
  'docs',
  'scripts',
  'package.json',
  'README.md'
];

for (const rel of itemsToCopy) {
  const src = path.join(rootDir, rel);
  const dest = path.join(stagingDir, rel);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
  }
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const zipName = `thuto-bridge-v1-${timestamp}.zip`;
const zipPath = path.join(backupsDir, zipName);

const psCommand = `powershell.exe -NoProfile -Command "Compress-Archive -Path '${stagingDir}\\*' -DestinationPath '${zipPath}' -Force"`;
execSync(psCommand);

// Clean staging
fs.rmSync(stagingDir, { recursive: true, force: true });

console.log(`[Backup] Fast local snapshot successfully created: ${zipPath}`);
