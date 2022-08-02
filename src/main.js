import { createApp } from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.less';
import './assets/styles/styles.scss'

import router from './router'

import './assets/styles/styles.scss'
// Ant
import { Layout, Button, Row, Col, Input, Select, Progress, Table, } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

createApp(App)
    .use(router)
    .use(Layout)
    .use(Button)
    .use(Col)
    .use(Row)
    .use(Input)
    .use(Select)
    .use(Progress)
    .use(Table)
    .mount('#app')
