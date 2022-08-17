<script setup>
const props = defineProps(['element'])
let element = props.element;
console.log(element);
</script>
<template>
  <a-card hoverable>
    <template #cover>
      <img src="https://gorodglazov.com/wp-content/uploads/2020/05/5u3ElJvPRWY-1.jpg" />
    </template>
    <a-card-meta title="Преображенский храм">
      <template #description>Площадь Свободы</template>
    </a-card-meta>
  </a-card>
</template>