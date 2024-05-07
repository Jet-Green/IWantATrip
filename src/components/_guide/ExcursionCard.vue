<script setup>
const props = defineProps({
  excursion: Object
})
const excursion = props.excursion
</script>
<template>
  <div class="card">
    <div class="title">
      {{ excursion.name }}
    </div>
    <img src="https://leanfactory.storage.yandexcloud.net/iwat/6627aaec69f5b7b2a35ac377_0.jpg" alt="картинка">
  </div>
</template>
<style scoped lang="scss">
.card {
  overflow: hidden;
  cursor: pointer;

  img {
    object-fit: cover;
    width: 100%;
    height: 175px
  }
}

.title {
  height: 100%;
  font-size: clamp(0.875rem, 0.7647rem + 0.1961vw, 1rem);
  color: black;
  text-align: center;
  font-weight: 500;
  background: rgb(245, 245, 245);
}
</style>