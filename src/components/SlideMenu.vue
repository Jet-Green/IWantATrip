<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { defineComponent } from "vue";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

//carousel__slide--active
const myCarousel = ref(null);
const carouselData = reactive(myCarousel);

const slideIndex = computed(() => {
  return carouselData.value.data.currentSlide.value;
});

const props = defineProps(["direction"]);
</script>

<template>
  <div @click="$emit('currentSlideIndex', slideIndex)">
    <Carousel ref="myCarousel">
      <Slide v-for="(item, index) in props.direction" :key="index">
        <div :id="index" class="carousel__item">{{ item.menuItem }}</div>
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
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