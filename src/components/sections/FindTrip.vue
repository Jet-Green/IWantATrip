<script setup>
import { ref, reactive, computed, onMounted } from "vue";

import { useRouter } from "vue-router";

import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

import TripCard from "../cards/TripCard.vue";

let router = useRouter();

let where = ref(null);
let how = ref(null);
let time = ref(null);

// внедрение карточек сделано криво
// tours for working cards
let tours = reactive(
  {
    image: "https://страна2-0.рф/wp-content/uploads/2020/09/W50HIZer2wQ-1024x682.jpg",
    eventName: "БИ-2",
  }
);

const poster = reactive({
  cards: [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    20,
    21,
    22,
    23,
    24,
    25,
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

function TripsPage() {
  router.push("/trips");
}

function toEventPage() {
  router.push({ name: "EventPage", params: { type: "event" } });
}
function focusOnWhere() { }

function handleChangeOnWhere() { }

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
      <a-row type="flex" justify="center">
        <a-col>
          <a-typography-title :level="2" style="color: white">Выберите готовый тур из 1000 представленных
          </a-typography-title>
        </a-col>
      </a-row>

      <a-row class="select-container">
        <a-col :md="5" :xs="24">
          <a-select style="width: 100%" placeholder="Куда едем" v-model:value="where" @focus="focusOnWhere"
            @change="handleChangeOnWhere" :bordered="false" size="large">
            <a-select-option value="1"> Туда </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="5" :xs="24">
          <a-select style="width: 100%" placeholder="Как едем" v-model:value="how" @focus="focusOnWhere"
            @change="handleChangeOnWhere" :bordered="false" size="large">
            <a-select-option value="1"> Так </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="5" :xs="24">
          <a-select style="width: 100%" placeholder="На сколько" v-model:value="time" @focus="focusOnWhere"
            @change="handleChangeOnWhere" :bordered="false" size="large">
            <a-select-option value="1"> На столько </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="5" :xs="24">
          <a-select style="width: 100%" placeholder="На сколько" v-model:value="time" @focus="focusOnWhere"
            @change="handleChangeOnWhere" :bordered="false" size="large">
            <a-select-option value="1"> На столько </a-select-option>
          </a-select>
        </a-col>
        <a-col :md="4" :xs="24">
          <a-button style="height: 100%; width: 100%; border-radius: 15px" type="primary" @click="TripsPage">
            Найти
          </a-button>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="24">
          <div ref="carousel_container"></div>
          <Carousel :itemsToShow="postsCount" :autoplay="25000" snapAlign="start" :wrapAround="true"
            class="unselectable">
            <Slide v-for="(cardsGroup, index) in cards" :key="index" class="unselectable">
              <div class="carousel__item" style="display: flex; flex-wrap: wrap">
                <TripCard :tour="tours" />
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
<style lang="scss">
.unselectable {
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

.carousel__prev,
.carousel__next {
  background-color: white;
  box-sizing: content-box;
  box-shadow: 1px 2px 2px #3daff5;
  color: black;

  &:active {
    box-shadow: 1px 1px 1px #3daff5;
    font-size: 18px;
  }
}

.find_trip_bg {
  background-color: #245159;
}

.select-container {
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
}
</style>
