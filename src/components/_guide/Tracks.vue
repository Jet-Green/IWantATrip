<script setup>
import BackButton from "../BackButton.vue";
import TrackCard from "./TrackCard.vue";
import { onMounted, ref } from "vue"

import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useTracks } from "../../stores/track";
import TrackFilter from "./TrackFilter.vue";

const backRoute = { name: 'Landing', hash: '#guide' };
const router = useRouter()
const route = useRoute();
const trackStore = useTracks()

// search stored in trackStore.filter.search
const isLoading = ref(false);

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
  isLoading.value = true;
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
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (route.query.search) {
    trackStore.filter.search = route.query.search;
  }
  await loadTracks();

  if (route.hash) {
    let id = route.hash.slice(1)
    document.getElementById(id)?.scrollIntoView()
    window.scrollBy(0, -100);
  }
});

</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h2>Маршруты</h2>
        <TrackFilter @refreshTracks="loadTracks" />
        
        <a-spin v-if="isLoading" size="large" style="display: flex; justify-content: center; margin: 40px 0;" />

        <a-row v-else :gutter="[12, 16]">
          <a-col :span="24" :sm="12" :md="8" v-for="track of trackStore.tracks" :key="track._id">
            <TrackCard :track="track" @click="router.push(`/track?_id=${track._id}`)" :id="track._id" />
          </a-col>
        </a-row>

        <a-row v-if="!trackStore.tracks.length && !isLoading">
          <a-col :span="24">
            <h3 style="text-align: center;">Маршруты не найдены!</h3>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>

</style>
