/ vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // 這是解決 Vercel 上網頁空白問題的關鍵設定
  base: '/',
  
  plugins: [react()],

  // 您可以保留原本的伺服器設定，以方便本機開發
  server: {
    port: 3000,
    host: '0.0.0.0',
  }
});
