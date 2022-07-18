<script setup>
import Header from "../components/Header.vue";
</script>

<template>
  <a-layout style="min-height: 100vh">
    <Header></Header>
    <a-layout-content>
      <router-view></router-view>
    </a-layout-content>
    <a-affix>
      <a-layout-footer>Это футер </a-layout-footer>
    </a-affix>
  </a-layout>
</template>
<style lang="scss" scoped>
</style>
