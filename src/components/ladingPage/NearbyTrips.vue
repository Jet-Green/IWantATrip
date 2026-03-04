<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from "vue-router"
import { useTrips } from '../../stores/trips'
import TripCard from '../cards/TripCard.vue'

const tripStore = useTrips()
const trips = computed(() => tripStore.trips)
const cardsContainer = ref(null)
const scrollContainer = ref(null)
const router = useRouter()

const width = ref(window.innerWidth)

const updateWidth = () => {
  width.value = window.innerWidth
}
// function setCardContainerWidth() {
//   let newWidth = width.value
//   // 1600 по 4 карточки
//   if (newWidth >= 1600) {
//     cardsContainer.value.style.width = (Math.floor(trips.value.length / 4) + 1) * 100 + "vw"
//   }
//   // 1020 по 3
//   else if (newWidth >= 1200) {
//     cardsContainer.value.style.width = (Math.floor(trips.value.length / 3) + 1) * 100 + "vw"
//   }
//   // 768 по 2
//   else if (newWidth >= 768) {
//     cardsContainer.value.style.width = (Math.floor(trips.value.length / 2) + 1) * 100 + "vw"
//   } else {
//     cardsContainer.value.style.width = trips.value * 100 + "vw"
//   }
// }
function setCardContainerWidth() {
  if (!cardsContainer.value) return

  const w = width.value
  let cardsPerRow = 2  // дефолт для мобильных

  if (w >= 1200) {
    cardsPerRow = 4
  } else if (w >= 768) {
    cardsPerRow = 3
  }

  const rowCount = Math.ceil(trips.value.length / cardsPerRow)
  cardsContainer.value.style.width = `${rowCount * 100}vw`
}

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -width.value,
      behavior: 'smooth'
    })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: width.value,
      behavior: 'smooth'
    })
  }
}

watch(width, () => setCardContainerWidth)

onMounted(async () => {
  window.addEventListener('resize', updateWidth)
  if (!tripStore.trips?.length) await tripStore.fetchTrips()
  updateWidth()
  setCardContainerWidth()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>

<template>
  <a-row v-if="trips.length" type="flex" justify="center">
    <a-col :span="22">
      <h3>Ближайшие туры</h3>
    </a-col>

    <a-col :span="24">
      <!-- ref здесь — на обычный div, а не на a-col -->
      <div ref="scrollContainer" class="scroll-wrapper">
        <div class="trip-list-container">
          <div class="card-container image-bg" ref="cardsContainer">
            <div v-for="(trip, i) in trips" :key="trip._id || i" class="card-col"
              :class="i % 2 === 0 ? 'top' : 'bottom'">
              <TripCard :trip="trip" :isPreview="true" />
            </div>
          </div>
        </div>
      </div>
    </a-col>

    <!-- <a-col :span="24" style="overflow-x: scroll; scrollbar-width: none;" ref="scrollContainer">
      <div class="trip-list-container">
        <div class="card-container image-bg" ref="cardsContainer">
          <div v-for="(trip, i) in trips" :key="(trip._id || i)" class="card-col"
            :class="i % 2 == 0 ? 'top' : 'bottom'">
            <TripCard :trip="trip" :isPreview="true" />
          </div>
        </div>
      </div>
    </a-col> -->
    <a-col :span="22">
      <a-row>
        <a-col :span="0" :md="8">
        </a-col>
        <a-col :span="12" :md="8" class="d-flex justify-center align-center">
          <div class="slider-btns-container">
            <button class="slider-btn" @click="scrollLeft">
              <span class="mdi mdi-chevron-left"></span>
            </button>
            <div class="divider"></div>
            <button class="slider-btn" @click="scrollRight">
              <span class="mdi mdi-chevron-right"></span>
            </button>
          </div>
        </a-col>
        <a-col :span="12" :md="8" class="d-flex justify-end">
          <button class="see-all-btn unselectable" @click="router.push('/trips')">Смотреть все</button>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped lang="scss">
.scroll-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  height: 70vh;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.trip-list-container {
  height: 70vh;
}

.card-col {
  display: flex;
  // gap: 30px;
  justify-content: center;
  padding: 10px;
  height: 70vh;
  flex: 0 0 50vw; // дефолт — 2 карточки на маленьких экранах

  @media (min-width: 768px) {
    flex: 0 0 33.333vw; // 3 карточки (1200–768 px)
  }

  @media (min-width: 1200px) {
    flex: 0 0 25vw; // 4 карточки (≥1200 px)
  }
}

.bottom {
  align-items: end;
  padding-bottom: 5vh;
}

.top {
  align-items: start;
  padding-top: 5vh;
}

.image-bg {
  background-image: url("/src/assets/images/nearby-trips.svg");
  background-repeat: repeat-x;
  background-position: left top;
  background-size: auto 100%;
}

.card-container {
  display: flex;

  // height: 70vh;

  // @media (max-width: 1200px) {
  //   background-size: cover;
  // }
}

h3 {
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  font-weight: 900;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.see-all-btn {
  background-color: #FF6600;
  border-radius: 999px;
  border: 0px;
  padding: 10px 50px;
  text-transform: none;
  font-size: clamp(0.875rem, 0.179rem + 1.9886vw, 1.75rem);
  color: white;
  cursor: pointer;

  transition: all 0.28s ease;
  transform: scale(1);

  &:hover {
    transform: scale(1.01);
  }

  &:active {
    transform: scale(0.97);
  }
}

.slider-btn {
  background-color: #63BED8;
  height: 50px;
  width: 50px;
  border-radius: 999px;
  border: 0;
  font-size: 30px;
  cursor: pointer;
}

.divider {
  height: 70%;
  background-color: #FF6600;
  width: 1px;
  margin-right: 10px;
  margin-left: 10px;
}

.slider-btns-container {
  display: flex;
  align-items: center;
  height: 50px;
}
</style>