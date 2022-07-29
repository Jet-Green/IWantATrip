<script setup>
import { ref, reactive, computed, onMounted } from "vue";

import { useRouter } from "vue-router";

import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

import TripCard from "../cards/TripCard.vue";


// внедрение карточек сделано криво
// tours for working cards
let tours = reactive({
  image:
    "https://страна2-0.рф/wp-content/uploads/2020/09/W50HIZer2wQ-1024x682.jpg",
  eventName: "БИ-2",
});

const poster = reactive({
  cards: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22,
    23, 24, 25,
  ],
});
let carouselWidth = ref(0);
const carousel_container = ref(null);

const cards = computed(() => {
  let postersGroup = [];
  postersGroup.push([poster.cards[0]]);
  for (let i = 1; i < poster.cards.length - 1; i += 4) {
    postersGroup.push(poster.cards.slice(i, i + 4));
  }
  return postersGroup;
});
// тут будет сортировка и первым элементом будет тот который нужен

let onResize = () => {
  carouselWidth.value = carousel_container.value.clientWidth;
};




const postsCount = computed(() => {
  return carouselWidth.value / 270;
});

onMounted(() => {
  onResize();
  window.addEventListener("resize", onResize);
});
</script>
<template>
  <a-row type="flex" justify="center" class="find_trip_bg pt-16 pb-16">
    <a-col :xs="20" :md="16" :lg="14">
      <a-row type="flex" justify="center" style="flex-direction: row">
        <a-col>
          <h2 style="color: white"
            >Выбери готовый тур
          </h2>
        </a-col>
      </a-row>

   

      <a-row>
        <a-col :span="24">
          <div ref="carousel_container"></div>
          <Carousel
            :itemsToShow="postsCount"
            :autoplay="25000"
            snapAlign="start"
            :wrapAround="true"
            class="unselectable"
          >
            <Slide
              v-for="(cardsGroup, index) in cards"
              :key="index"
              class="unselectable"
            >
              <div
                class="carousel__item"
                style="display: flex; flex-wrap: wrap"
              >
                <TripCard :tour="tours" :isPreview="true" />
              </div>
            </Slide>
            <template #addons>
              <Navigation />
            </template>
          </Carousel>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<style scoped>
.find_trip_bg {
    background: linear-gradient(270.04deg, #245159 0.04%, #24594F 99.97%);
}
</style>
