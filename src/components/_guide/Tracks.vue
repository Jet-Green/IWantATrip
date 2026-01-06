<script setup>
import BackButton from "../BackButton.vue";
import TrackCard from "./TrackCard.vue";
import { onMounted, ref } from "vue"

import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useTracks } from "../../stores/track";

const backRoute = { name: 'Landing' };
const router = useRouter()
const route = useRoute();
const trackStore = useTracks()

const searchQuery = ref('');
const isLoading = ref(false);

const loadTracks = async () => {
  isLoading.value = true;
  try {
    await trackStore.getAll(1, {
      search: searchQuery.value
    });
  } catch (error) {
    console.error('Ошибка загрузки маршрутов:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (route.query.search) {
    searchQuery.value = route.query.search;
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
        
        <div class="search-section mb-4">
          <a-input-search
            v-model:value="searchQuery"
            placeholder="Поиск маршрутов..."
            size="large"
            @search="loadTracks"
            allow-clear
          />
        </div>

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
.search-section {
  margin: 20px 0;
}
</style>
