<script setup>
import Header from "./components/Header.vue";
</script>
<template>
  <a-layout style="min-height: 100vh">
    <Header></Header>
    <!-- в документации с margin'ом, чтобы предотвратить перекрывание контента хедром -->
    <a-layout-content style="margin-top: 69px;">
      <router-view></router-view>
    </a-layout-content>
    <a-affix>
      <a-layout-footer>Это футер </a-layout-footer>
    </a-affix>
  </a-layout>
</template>
<style>
</style>
