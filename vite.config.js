
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'


const { theme } = require('ant-design-vue/lib');
const convertLegacyToken = require('ant-design-vue/lib/theme/convertLegacyToken.js');

const { defaultAlgorithm, defaultSeed } = theme;

const mapToken = defaultAlgorithm(defaultSeed);
const v3Token = convertLegacyToken.default(mapToken);





// import fs from 'fs'
// import path from 'path'
// import lessToJs from 'less-vars-to-js';
// const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, 'src/assets/styles/antd_default.less'), 'utf8'));

// https://vitejs.dev/config/
export default defineConfig(

  ({
    command,
    mode
  }) => {
    // let baseUrl = mode == 'development' ? '/' : '/IWantATrip/'
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return {
      optimizeDeps: { // 👈 optimizedeps
        esbuildOptions: {
          target: "esnext",
          // Node.js global to browser globalThis
          define: {
            global: 'globalThis'
          },
          supported: {
            bigint: true
          },
        }
      },
      build: {
        target: ["esnext"], // 👈 build.target
      },
      // base: baseUrl,
      plugins: [
        vue(),
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            // Контролируем кэширование файлов, чтобы обновлять их только при изменениях
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [{
              urlPattern: ({ request }) => request.destination === 'document',
              handler: 'NetworkFirst', // Получаем данные из сети, если возможно
              options: {
                cacheName: 'html-cache',
              }
            }]
          },
          includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'images/apple-touch-icon.png'],
          manifest: {
            name: 'Города и веси',
            short_name: 'Города и веси',
            description: 'Description of your app',
            theme_color: '#ffffff',
            background_color: "#ffffff",
            version: "1.1.2",
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
      loader: 'less-loader',
      options: {
        lessOptions: {
          modifyVars: v3Token,
        },
      },
      // css: {
      //   preprocessorOptions: {
      //     less: {
      //       modifyVars: themeVariables,
      //       javascriptEnabled: true
      //     }
      //   }
      // },
    }
  })