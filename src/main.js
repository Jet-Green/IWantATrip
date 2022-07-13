import { createApp } from 'vue'
import App from './App.vue'
import antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import './assets/styles/styles.scss'

import router from './router'

createApp(App)
    .use(router)
    .use(antd)
    .mount('#app')
