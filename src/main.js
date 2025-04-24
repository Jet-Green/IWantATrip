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
// import yandexMetrika from './plugins/yandexMetrika';
// import yandexMetrika from './plugins/yandexMetrika';
import { ConfigProvider } from 'ant-design-vue';
// registerSW({ immediate: true })
import { createHead } from '@unhead/vue/client'






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
const head = createHead()

createApp(App)
    .use(pinia)
    .use(head)
    .use(router)
    .use(ANTD)
    .use(VueSocialSharing)
    .use(VueHtmlToPaper)
    .use(MasonryWall)
    // .use(yandexMetrika, { id: 98607105 })
    .use(ConfigProvider)
    .mount('#app')

