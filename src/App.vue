<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

import { useTrips } from './stores/trips'
import { useAuth } from './stores/auth'

const route = useRoute()
const userStore = useAuth()

onMounted(() => {
  useTrips().fetchTrips()
  if (localStorage.getItem('token')) {
    userStore.checkAuth()
  }
})
</script>
<template>
  <a-layout style="min-height: 100vh">
    <Header></Header>
    <!-- в документации с margin'ом, чтобы предотвратить перекрывание контента хедром -->
    <a-layout-content style="margin-top: 69px">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </a-layout-content>
    <Footer></Footer>
  </a-layout>
</template>
<style>

</style>
