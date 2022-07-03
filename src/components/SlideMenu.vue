<script setup>
import { ref, computed, reactive } from "vue";
import { defineComponent } from "vue";
import { Carousel, Navigation, Slide } from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";

const props = defineProps(["direction"]);
</script>

<template>
  <Carousel>
    <Slide v-for="(item, index) in props.direction" :key="index">
      <div class="carousel__item">{{ item.menuItem }}</div>
    </Slide>
    <template #addons>
      <Navigation />
    </template>
  </Carousel>
</template>
<style lang="scss">
.carousel__item {
  width: 100%;
  font-size: clamp(18px, 2vw, 20px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  padding: 5px;
}

.carousel__prev,
.carousel__next {
  background-color: rgba(0, 0, 0, 0);
  box-sizing: content-box;
  font-size: 24px;
  color: white;

  &:active {
    font-size: 0.9em;
  }
}
.carousel__prev--in-active,
.carousel__next--in-active {
  display: none;
}
</style>