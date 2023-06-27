<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import { useTrips } from "../../stores/trips";
import "vue3-carousel/dist/carousel.css";

import TripCard from "../cards/TripCard.vue";

const useTripsStore = useTrips();

let carouselWidth = ref(0);
const carousel_container = ref(null);

const trips = computed(() => {
  return useTripsStore.trips;
});
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
  if (carousel_container.value) {
    carouselWidth.value = carousel_container.value.clientWidth;
  }
};

const postsCount = computed(() => {
  if (carouselWidth.value < 600) {
    return 1;
  } else {
    return carouselWidth.value / 270;
  }
});

watch(carousel_container, () => {
  onResize();
});
onMounted(async () => {
  await useTrips().fetchTrips();
  onResize();
  window.addEventListener("resize", onResize);
});
</script>
<template>
  <a-row type="flex" justify="center" class="find_trip_bg pt-16 pb-16">
    <a-col :xs="20" :md="16" :lg="14">
      <a-row type="flex" justify="center" style="flex-direction: row">
        <a-col>
          <h2 style="color: white">Выбери готовый тур</h2>
        </a-col>
      </a-row>
      <a-row v-if="trips.length">
        <a-col :span="24">
          <div class="section">
            <Slide v-for="trip in trips" :key="trip.index" class="unselectable ma-8 section__item">
              <div class="d-flex justify-center" style="width: 100%">
                <TripCard :trip="trip" :isPreview="true" />
              </div>
            </Slide>
          </div>
        </a-col>
      </a-row>
      <a-row v-else>
        <a-col :span="24" class="d-flex justify-center align-center">
          <a-spin size="large"></a-spin>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<style scoped>
.find_trip_bg {
  background: linear-gradient(270deg, #24b0d6, #27728b);
}

.carousel__slide {
  align-items: end;
}

.section {
  display: flex;
  align-items: center;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 5px;
  gap: 1rem;
  -webkit-overflow-scrolling: touch; 
}

.section__item {
  scroll-snap-align: center;
  scroll-snap-stop: always;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 20%;
}
</style>
