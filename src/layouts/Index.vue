<script setup>
import Header from "../components/Header.vue";
import { useRoute } from "vue-router";

let route = useRoute()
</script>
<template>

  <!-- min-height + фон на самом layout: иначе при коротком контенте снизу светит белый .ant-layout -->
  <a-layout style="min-height: 100vh; background-color: #FFFEF4;">
    <Header></Header>
    <!-- в документации с margin'ом, чтобы предотвратить перекрывание контента хедром -->
    <a-layout-content style="background-color: #FFFEF4;" :style="route.path == '/' ? '' : 'padding-top: 80px'">
      <Suspense>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </Suspense>
    </a-layout-content>
  </a-layout>
</template>
<style></style>
