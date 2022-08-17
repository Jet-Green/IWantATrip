<script setup>
const props = defineProps({
  element: Object
})
</script>
<template>
  <a-card hoverable>
    <template #cover>
      <img :src="props.element.image" />
    </template>
    <span class="title">{{props.element.name}}</span>
  </a-card>
</template>
<style lang="scss" scoped>
.title{
  font-size: 18px;
}
</style>