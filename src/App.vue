<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

import { useTrips } from './stores/trips'
import { useCompanions } from './stores/companions'
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
  await locationStore.setLocation()
  await locationStore.fetchLocations()

  function notify() {
    let notification = new Notification("Привет", {
      tag: "ache-mail",
      body: "Хочу в поездку - крутой проект. Это уведомление будет показано только один раз",
      icon: "https://glazov-flash.ru/image/cache/catalog/icon/1_1-100x100.png"
    })
  }


  // if (Notification.permission == 'granted') {
  //   notify()
  // } else
  if (Notification.permission != 'denied' & Notification.permission != 'granted') {
    Notification.requestPermission(function (permission) {
      if (!('permission' in Notification))
        Notification.permission = permission
      if (permission == 'granted')
        notify()
    })
  }
})
</script>
<template>
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
    <Footer></Footer>
  </a-layout>
</template>
<style></style>
