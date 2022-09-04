import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'



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
    let baseUrl = mode == 'development' ? '/' : '/IWantATrip/'
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return {
      base: baseUrl,
      plugins: [
        vue()
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