<script setup>
import SlideMenu from "../components/SlideMenu.vue";
import { defineComponent, ref, reactive } from "vue";

const direction = reactive([
  {
    menuItem: "Заграница",
    image:
      "https://stolica-s.su/wp-content/uploads/2019/06/1560237775-stolica-s-su-Kak-nakopit-na-otpusk-mechty-2.jpg",
  },
  {
    menuItem: "Рядом",
    image: "https://geo-1.ru/wp-content/uploads/2018/10/21-5.jpg",
  },
  {
    menuItem: "По России",
    image:
      "https://stolica-s.su/wp-content/uploads/2019/06/1560237775-stolica-s-su-Kak-nakopit-na-otpusk-mechty-2.jpg",
  },
  {
    menuItem: "Море",
    image: "https://geo-1.ru/wp-content/uploads/2018/10/21-5.jpg",
  },
]);
</script>

<template>
  <div
    :style="{
      background: `url(https://geo-1.ru/wp-content/uploads/2018/10/21-5.jpg)`,
      height: '100vh',
      'background-size': 'cover',
      'background-repeat':   'no-repeat',
      'background-position': 'center center', 
    }"
  >
    <h1>Хочу в поездку</h1>

    <SlideMenu @change="console.log(event)" :direction="direction" />
  </div>
</template>
<style>
</style>