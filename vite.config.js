import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'



import fs from 'fs'
import path from 'path'
import lessToJs from 'less-vars-to-js';
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, 'src/assets/styles/antd_default.less'), 'utf8'));

// https://vitejs.dev/config/
export default defineConfig(

  ({
    command,
    mode
  }) => {
    // let baseUrl = mode == 'development' ? '/' : '/IWantATrip/'
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return {
      // base: baseUrl,
      plugins: [
        vue(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'images/apple-touch-icon.png'],
          manifest: {
            name: 'Города и веси',
            short_name: 'Города и веси',
            description: 'Description of your app',
            theme_color: '#ffffff',
            background_color: "#ffffff",
            display: "standalone",
            icons: [
              {
                src: 'android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
              {
                src: 'apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
              },

              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
              }
            ]
          }
        })
      ],
      css: {
        preprocessorOptions: {
          less: {
            modifyVars: themeVariables,
            javascriptEnabled: true
          }
        }
      },
    }
  })