<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTracks } from '../stores/track';
import { useAuth } from '../stores/auth';

const router = useRouter();
const trackStore = useTracks();
const userStore = useAuth();

const tracks = ref([]);
const isLoading = ref(true);
const currentPage = ref(1);
const searchQuery = ref('');

const loadTracks = async () => {
  isLoading.value = true;
  try {
    const result = await trackStore.getAll(currentPage.value, {
      search: searchQuery.value
    });
    tracks.value = result || [];
  } catch (error) {
    console.error('Ошибка загрузки маршрутов:', error);
  } finally {
    isLoading.value = false;
  }
};

const goToTrack = (trackId) => {
  router.push({ name: 'TrackPage', query: { id: trackId } });
};

const createTrack = () => {
  router.push({ name: 'CreateTrack' });
};

const editTrack = (trackId) => {
  router.push({ name: 'EditTrack', params: { id: trackId } });
};

const deleteTrack = async (trackId) => {
  try {
    await trackStore.deleteTrack(trackId);
    await loadTracks();
  } catch (error) {
    console.error('Ошибка удаления маршрута:', error);
  }
};

onMounted(() => {
  loadTracks();
});
</script>

<template>
  <div class="tracks-page">
 
      <h1>Маршруты</h1>

    <div class="tracks-search">
      <a-input-search
        v-model:value="searchQuery"
        placeholder="Поиск маршрутов..."
        size="large"
        @search="loadTracks"
        allow-clear
      />
    </div>

    <div v-if="isLoading" class="loading-container">
      <a-spin size="large" />
    </div>

    <div v-else-if="tracks.length === 0" class="empty-container">
      <a-empty description="Маршруты не найдены" />
    </div>

    <div v-else class="tracks-grid">
      <a-card
        v-for="track in tracks"
        :key="track._id"
        hoverable
        class="track-card"
        @click="goToTrack(track._id)"
      >
        <template #title>
          <div class="track-title">{{ track.title }}</div>
        </template>
        
        <template #extra>
          <div v-if="userStore.user && userStore.user._id === track.author" class="track-actions" @click.stop>
            <a-button 
              type="link" 
              size="small"
              @click="editTrack(track._id)"
            >
              Редактировать
            </a-button>
            <a-popconfirm
              title="Удалить маршрут?"
              ok-text="Да"
              cancel-text="Нет"
              @confirm="deleteTrack(track._id)"
            >
              <a-button 
                type="link" 
                danger
                size="small"
              >
                Удалить
              </a-button>
            </a-popconfirm>
          </div>
        </template>

        <div class="track-subtitle">{{ track.subtitle }}</div>
        
        <div class="track-info">
          <div class="info-item">
            <span class="mdi mdi-walk"></span>
            <span>{{ track.type || 'пешком' }}</span>
          </div>
          <div v-if="track.length" class="info-item">
            <span class="mdi mdi-ruler"></span>
            <span>{{ track.length }} км</span>
          </div>
          <div v-if="track.duration" class="info-item">
            <span class="mdi mdi-clock-outline"></span>
            <span>{{ Math.round(track.duration / 60) }} ч</span>
          </div>
        </div>

        <div v-if="track.description" class="track-description" v-html="track.description"></div>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
.tracks-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tracks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.tracks-header h1 {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
}

.tracks-search {
  margin-bottom: 30px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.tracks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.track-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.track-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.track-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.track-actions {
  display: flex;
  gap: 8px;
}

.track-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.track-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #555;
}

.info-item .mdi {
  font-size: 16px;
  color: #4285F4;
}

.track-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-description :deep(p) {
  margin: 0;
}

.track-description :deep(*) {
  font-size: 14px !important;
}

@media (max-width: 768px) {
  .tracks-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .tracks-grid {
    grid-template-columns: 1fr;
  }
}
</style>
