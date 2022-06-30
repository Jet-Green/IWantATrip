<script setup>
import { defineComponent, ref } from "vue";
import { Carousel, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

const myCarousel = ref(null);



</script>

<template>
  <h1>Хочу в поездку</h1>
  <div class="wrapper">
    <Carousel :itemsToShow="2" :wrapAround="true" ref="myCarousel">
      <Slide v-for="slide in 10" :key="slide" @click="myCarousel.next()">
        <div class="carousel__item">направление</div>
      </Slide>
    </Carousel>
  </div>
   <div class="wrapper">
    <Carousel :itemsToShow="2" :wrapAround="true" ref="myCarousel">
      <Slide v-for="slide in 10" :key="slide" @click="myCarousel.next()">
        <div class="carousel__item">бюджет</div>
      </Slide>
    </Carousel>
  </div>
   <div class="wrapper">
    <Carousel :itemsToShow="2" :wrapAround="true" ref="myCarousel">
      <Slide v-for="slide in 10" :key="slide" @click="myCarousel.next()">
        <div class="carousel__item">время</div>
      </Slide>
    </Carousel>
  </div>
</template>
<style>
.carousel__slide > .carousel__item {
  transform: scale(1);
  opacity: 0.5;
  transition: 0.5s;
}
.carousel__slide--visible > .carousel__item {
  opacity: 1;
  transform: rotateY(0);
}
.carousel__slide--next > .carousel__item {
  transform: scale(0.9) translate(-10px);
}
.carousel__slide--prev > .carousel__item {
  transform: scale(0.9) translate(10px);
}
.carousel__slide--active > .carousel__item {
  transform: scale(1.3);
}

.carousel__item {
  font: size 2em;
  font-weight: bold;

}

.wrapper {
  width: 250px;
  margin:30px
 
}
</style>