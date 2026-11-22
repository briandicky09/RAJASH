import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function herdSpaPlugin() {
  const publicDir = path.resolve('backend/public');
  const assetsDir = path.join(publicDir, 'assets');
  const indexFile = path.join(publicDir, 'index.html');
  const spaFile = path.join(publicDir, 'spa.html');

  return {
    name: 'rajash-herd-spa',
    buildStart() {
      if (fs.existsSync(assetsDir)) {
        fs.rmSync(assetsDir, { recursive: true, force: true });
      }
    },
    closeBundle() {
      if (fs.existsSync(indexFile)) {
        fs.renameSync(indexFile, spaFile);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), herdSpaPlugin()],
  build: {
    outDir: 'backend/public',
    emptyOutDir: false
  },
  server: {
    port: 5173,
    host: true
  }
});
