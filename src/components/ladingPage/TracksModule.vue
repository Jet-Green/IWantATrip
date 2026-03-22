<script setup>
import TrackFilter from '../_guide/TrackFilter.vue';
import TrackCard from '../_guide/TrackCard.vue';
import { ref, onMounted } from 'vue';
import { useTracks } from '../../stores/track';

import { useRouter } from 'vue-router';

const router = useRouter()
const trackStore = useTracks()

const scrollContainer = ref(null)

const conditions = () => {
  const c = {}
  if (trackStore.filter.location?.coordinates?.length) {
    c.location = trackStore.filter.location
  }
  if (trackStore.filter.locationRadius) {
    c.locationRadius = trackStore.filter.locationRadius
  }
  return Object.keys(c).length ? c : undefined
}

const loadTracks = async () => {
  const filter = {
    search: trackStore.filter.search,
    type: trackStore.filter.type,
    isActive: true,
    isModeration: true,
    isRejected: false,
    isHidden: false,
    conditions: conditions()
  };
  try {
    await trackStore.getAll(1, filter);
  } catch (error) {
    console.error('Ошибка загрузки маршрутов:', error);
  }
};

onMounted(async () => {
  await loadTracks();
})

function scrollLeft() {
  if (!scrollContainer.value) return
  const width = scrollContainer.value.clientWidth
  scrollContainer.value.scrollBy({
    left: -width,
    behavior: 'smooth'
  })
}

function scrollRight() {
  if (!scrollContainer.value) return
  const width = scrollContainer.value.clientWidth
  scrollContainer.value.scrollBy({
    left: +width,
    behavior: 'smooth'
  })
}
</script>
<template>
  <div class="container">
    <div class="module-card">
      <div class="cols-22">
        <h3 v-if="trackStore.tracks.length > 0">Маршруты</h3>
        <h3 v-else>Маршруты не найдены...</h3>
        <div style="display: none;">
          <TrackFilter @refreshTracks="loadTracks" />
        </div>
        <div v-if="trackStore.tracks.length > 0">
          <div class="scroll-container" :gutter="[16, 16]" ref="scrollContainer">
            <div class="scroll-container-col" v-for="track of trackStore.tracks" :key="track._id">
              <TrackCard :track="track" @click="router.push(`/track?_id=${track._id}`)" :id="track._id" />
            </div>
          </div>
        </div>

        <div class="actions">
          <button class="see-all-btn unselectable" @click="router.push('/tracks-list')">Смотреть все</button>

          <div class="slider-btns-container" v-if="trackStore.tracks.length > 0">
            <button class="slider-btn" @click="scrollLeft">
              <span class="mdi mdi-chevron-left"></span>
            </button>
            <div class="divider"></div>
            <button class="slider-btn" @click="scrollRight">
              <span class="mdi mdi-chevron-right"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
h3 {
  font-size: clamp(1rem, -0.1932rem + 3.4091vw, 2.5rem);
  font-weight: 900;
  line-height: 1;
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.module-card {
  background: white;
  border-radius: 28px;
  width: calc(100vw*23/24);
  padding: calc(100vw*0.5/24) 0;
  display: flex;
  justify-content: center;

}

.cols-22 {
  width: calc(100vw*22/24)
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
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
  transition: all 0.28s ease;
  transform: scale(1);

  &:hover {
    transform: scale(1.01);
  }

  &:active {
    transform: scale(0.9);
  }
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

.scroll-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 16px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  .scroll-container-col {
    flex: 0 0 100%;
    min-width: 0;
  }

  @media (min-width: 520px) {
    .scroll-container-col {
      flex: 0 0 calc(50% - 8px);
    }
  }

  @media (min-width: 768px) {
    .scroll-container-col {
      flex: 0 0 calc((100% - 32px) / 3);
    }
  }

  @media (min-width: 1200px) {
    .scroll-container-col {
      flex: 0 0 calc((100% - 48px) / 4);
    }
  }

  .scroll-container::-webkit-scrollbar {
    display: none;
  }
}
</style>