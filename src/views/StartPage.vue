<script setup>
</script>

<template>
  <a-layout :style="{
    background: `url(${getCurrentImage})`,
    height: '100vh',
    'background-size': 'cover',
    'background-repeat': 'no-repeat',
    'background-position': 'center center',
  }">
    <a-layout-header>
      <h1>Хочу в поездку</h1>
    </a-layout-header>
    <a-layout-content>
    </a-layout-content>
    <a-layout-footer :style="{ bottom: 0, zIndex: 1, width: '100%' }">меню текст
    </a-layout-footer>
  </a-layout>
</template>
<style lang="scss" scoped>
</style>
