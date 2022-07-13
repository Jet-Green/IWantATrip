import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(
  ({
    command,
    mode
  }) => {
    let baseUrl = mode == 'development' ? '/' : '/IWantATrip/'
    return {
      base: baseUrl,
      plugins: [vue()],
      css: {
        preprocessorOptions: {
          less: {
            modifyVars: {

            },
            // modifyVars: getThemeVariables({
            //   dark: true,
            //   // compact: true,
            // }),
            javascriptEnabled: true,
          },
        },
      },
    }
  })