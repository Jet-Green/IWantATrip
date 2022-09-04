import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/antd.less';
import './assets/styles/styles.scss'
// Ant
import { Layout, Button, Row, Col, Input, Select, Progress, Table, Divider, Drawer, Form, Modal, Card, Space, Upload, DatePicker, Badge, Affix, Spin } from 'ant-design-vue';
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
    .use(Space)
    .use(Upload)
    .use(DatePicker)
    .use(Badge)
    .use(Affix)
    .use(Spin)
    .mount('#app')
