import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // Aggressively find ANY key that looks like an API key
  const finalKey = env.GROK_API_KEY || env.API_KEY || env.VITE_GROK_API_KEY || env.VITE_API_KEY || '';

  if (finalKey) {
    console.log("✅ SUCCESS: Found API Key! (Starting with " + finalKey.substring(0, 4) + ")");
  } else {
    console.log("❌ ERROR: No API Key found in .env.local. Checked: GROK_API_KEY, API_KEY, VITE_GROK_API_KEY");
  }

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api/xai': {
          target: 'https://api.groq.com/openai/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/xai/, ''),
          secure: false
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(finalKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
