<script setup>
import { ref, onMounted, watch } from "vue";
import { usePhotos } from "../../stores/photos";
import MyPhotobankPhotoCard from "./MyPhotobankPhotoCard.vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const photosStore = usePhotos();
const photos = ref([]);
const page = ref(1);
const loading = ref(true);
const loadingMore = ref(false);
const showMoreButton = ref(false);

async function loadPhotos(reset = false) {
  if (reset) {
    page.value = 1;
    photos.value = [];
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  try {
    const res = await photosStore.getMyPhotos(props.status, page.value);
    const chunk = Array.isArray(res.data?.items) ? res.data.items : [];
    photos.value = reset ? chunk : [...photos.value, ...chunk];
    showMoreButton.value = !!res.data?.hasMore && chunk.length > 0;
  } catch {
    if (reset) photos.value = [];
    showMoreButton.value = false;
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

async function loadMore() {
  if (loadingMore.value || !showMoreButton.value) return;
  page.value++;
  await loadPhotos(false);
}

watch(
  () => props.status,
  () => loadPhotos(true)
);

onMounted(() => loadPhotos(true));
</script>

<template>
  <div class="my-photobank-list">
    <div v-if="loading" class="my-photobank-list__loading">
      <img src="../../assets/images/founddog.webp" alt="" />
    </div>

    <template v-else>
      <a-row v-if="photos.length" :gutter="[8, 8]" class="my-photobank-list__grid">
        <a-col v-for="photo in photos" :key="photo._id" :lg="8" :sm="12" :xs="24">
          <MyPhotobankPhotoCard :photo="photo" @refresh="loadPhotos(true)" />
        </a-col>
      </a-row>

      <p v-else class="my-photobank-list__empty">Нет фото</p>

      <div v-if="photos.length && showMoreButton" class="my-photobank-list__more">
        <a-button :loading="loadingMore" @click="loadMore">Ещё</a-button>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.my-photobank-list {
  width: 100%;
}

.my-photobank-list__loading {
  display: flex;
  justify-content: center;
  padding: 24px 0;

  img {
    height: 150px;
  }
}

.my-photobank-list__grid {
  width: 100%;
  margin-top: 8px;
}

.my-photobank-list__empty {
  margin: 16px 0 0;
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
}

.my-photobank-list__more {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}
</style>
