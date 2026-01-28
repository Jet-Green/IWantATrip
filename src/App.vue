<script setup>
import { onBeforeMount, ref } from 'vue'


import { useLocations } from './stores/locations'
import { useAuth } from './stores/auth'
import { useAppState } from './stores/appState'


const userStore = useAuth()
const appStateStore = useAppState()
const locationStore = useLocations()
const isInitialized = ref(false)


onBeforeMount(async () => {
  await appStateStore.refreshState()
  // Всегда проверяем auth - восстанавливаем access token из refresh token в cookies
  await userStore.checkAuth()
  // вся логика локации тут
  await locationStore.fetchLocations()
  if (localStorage.getItem('location')) {
    locationStore.location = JSON.parse(localStorage.getItem('location'))
  }
  isInitialized.value = true
})



</script>
<script data-noptimize="1" data-cfasync="false" data-wpfc-render="false">
  (function () {
      var script = document.createElement("script");
      script.async = 1;
      script.src = 'https://emrld.ltd/NDkzMjQw.js?t=493240';
      document.head.appendChild(script);
  })();
</script>
<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#ff6600',
      colorInfo: '#ff6600',
      colorSuccess: '#BCC662',
      borderRadius: 0,
      fontFamily: 'Montserrat',
      colorBgLayout: 'white',
      colorBgBody: 'rgba(0, 0, 0, 0)',
      cardPaddingBase: ' 0px',
      lineHeight: 1.5714285714285714,
    },
  }">
  
          <router-view v-if="isInitialized" v-slot="{ Component }">        
              <component :is="Component" />
          </router-view>
 
  </a-config-provider>
</template>
<style></style>
