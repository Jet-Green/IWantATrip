<script setup>
import SlideMenu from "../components/slideMenu.vue"
import { defineComponent, ref } from "vue";
import { Carousel, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

const myCarousel = ref(null);



</script>

<template>
  <h1>Хочу в поездку</h1>
<SlideMenu/>
<SlideMenu/>
<SlideMenu/>
</template>
<style>


</style>