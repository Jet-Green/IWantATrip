import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ANTD from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.less';
import './assets/styles/styles.scss'
import VueHtmlToPaper from './plugins/VueHtmlToPaper'
import VueSocialSharing from 'vue-social-sharing'
import MasonryWall from '@yeger/vue-masonry-wall'
import 'ant-design-vue/dist/reset.css';
import { registerSW } from 'virtual:pwa-register'

// registerSW({ immediate: true })

let refreshing = false;
const updateSW = registerSW({   
    onNeedRefresh() {
      console.log('Новая версия доступна. Предложите пользователю обновить страницу.');
      if (refreshing) return; // Если перезагрузка уже произошла, больше не делаем этого
      refreshing = true;
      window.location.reload();
      // Здесь можно добавить логику для показа уведомления о новой версии
    },
    onOfflineReady() {
      console.log('Приложение готово для работы в оффлайн режиме.');
    }
  });

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .use(ANTD)
    .use(VueSocialSharing)
    .use(VueHtmlToPaper)
    .use(MasonryWall)
    .mount('#app')

