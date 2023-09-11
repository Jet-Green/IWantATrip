<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from "./components/Header.vue";

import { useLocations } from './stores/locations'
import { useAuth } from './stores/auth'
import { useAppState } from './stores/appState'

const route = useRoute()
const userStore = useAuth()
const appStateStore = useAppState()
const locationStore = useLocations()


onMounted(async () => {
  await appStateStore.refreshState()
  if (localStorage.getItem('token')) {
    await userStore.checkAuth()
  }
  // вся логика локации тут
  await locationStore.fetchLocations()


  // function notify() {
  //   let notification = new Notification("Привет", {
  //     tag: "ache-mail",
  //     body: "Хочу в поездку - крутой проект. Это уведомление будет показано только один раз",
  //     icon: "https://glazov-flash.ru/image/cache/catalog/icon/1_1-100x100.png"
  //   })
  // }


  // if (Notification.permission == 'granted') {
  //   notify()
  // } else
  // if (Notification.permission != 'denied' & Notification.permission != 'granted') {
  //   Notification.requestPermission(function (permission) {
  //     if (!('permission' in Notification))
  //       Notification.permission = permission
  //     if (permission == 'granted')
  //       notify()
  //   })
  // }
})

// @success-color: #BCC662; // success state color
// @primary-color: #ff6600; // primary color for all components
// @layout-header-background: rgba(255, 255, 255);
// @layout-body-background: rgba(0, 0, 0, 0);
// @card-padding-base: 0px;

</script>
<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#ff6600',
      colorSuccess: '#BCC662',
      borderRadius: 0,
      fontFamily: 'Montserrat',
      colorBgLayout: 'white',
      colorBgBody: 'rgba(0, 0, 0, 0)',
      cardPaddingBase: ' 0px',
      lineHeight: 1.5714285714285714,
  


    },
  }">
    <a-layout>
      <Header></Header>
      <!-- в документации с margin'ом, чтобы предотвратить перекрывание контента хедром -->
      <a-layout-content style="margin-top: 69px">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-config-provider>
</template>
<style></style>
