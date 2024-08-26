<script setup>
import { onMounted } from 'vue'


import { useLocations } from './stores/locations'
import { useAuth } from './stores/auth'
import { useAppState } from './stores/appState'


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
  if (localStorage.getItem('location')) {
    locationStore.location = JSON.parse(localStorage.getItem('location'))
  }


})



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
  
          <router-view v-slot="{ Component }">        
              <component :is="Component" />
          </router-view>
 
  </a-config-provider>
</template>
<style></style>
