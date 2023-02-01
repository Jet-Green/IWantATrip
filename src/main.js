import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ANTD from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import './assets/styles/styles.scss'

import 'ant-design-vue/dist/antd.less';
const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .use(ANTD)
    .mount('#app')
