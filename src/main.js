import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/antd.less';
import './assets/styles/styles.scss'
import router from './router'
import './assets/styles/styles.scss'
// Ant
import { Layout, Button, Row, Col, Input, Select, Progress, Table, Divider, Drawer, Form, Modal, Card, Space } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .use(Card)
    .use(Layout)
    .use(Button)
    .use(Col)
    .use(Row)
    .use(Input)
    .use(Select)
    .use(Progress)
    .use(Table)
    .use(Divider)
    .use(Drawer)
    .use(Form)
    .use(Modal)
    .use(Card)
    .use(Space)
    .mount('#app')
