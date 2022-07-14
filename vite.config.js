import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import fs from 'fs'
import path from 'path'
import  lessToJs  from 'less-vars-to-js';

const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, 'src/assets/styles/antd_default.less'), 'utf8'));

// https://vitejs.dev/config/
export default defineConfig(
  ({
    command,
    mode
  }) => {
    let baseUrl = mode == 'development' ? '/' : '/IWantATrip/'
    return {
      base: baseUrl,
      plugins: [
        Components({
          resolvers: [
            AntDesignVueResolver({importStyle: "less"}),
          ],
          dts: true,
          include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/, /\.jsx$/]
        }),
        vue(),
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