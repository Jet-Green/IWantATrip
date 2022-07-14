import { createApp } from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.less';
import './assets/styles/styles.scss'

import router from './router'

import './assets/styles/styles.scss'
// Ant
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

createApp(App)
    .use(router)
    .use(Antd)
    .mount('#app')
