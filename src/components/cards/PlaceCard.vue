<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  place: Object
})

const place = props.place
const isModalOpen = ref(false)
const router = useRouter()

function openModal() {
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function goToTrip(tripId) {
  router.push(`/trip?_id=${tripId}&history=true`)
  closeModal()
}
</script>
<template>
  <div class="place-card" :style="{ 'background-image': 'url(' + place?.images?.[0] + ')' }" @click="openModal">
    <div class="content">
      <div class="title">{{ place?.name }}</div>
      <div class="category">{{ place?.category?.toLowerCase() }}</div>
      <div class="description" v-if="place?.shortDescription">{{ place?.shortDescription }}</div>
    </div>
  </div>

  <a-modal v-model:open="isModalOpen" :footer="null" :width="800" :closable="false" @cancel="closeModal">
    <div class="place-modal">
      <button class="close-btn" @click="closeModal">
        <span class="mdi mdi-close"></span>
      </button>
      <a-carousel arrows dots-class="slick-dots slick-thumb" v-if="place?.images?.length">
        <div v-for="(img, index) in place.images" :key="index">
          <img :src="img" style="width: 100%; aspect-ratio: 16/9; object-fit: cover;" />
        </div>
      </a-carousel>

      <h2>{{ place?.name }}</h2>
      <p class="category">{{ place?.category }}</p>

      <div class="info-grid">
        <div class="info-item" v-if="place?.openingHours">
          <span class="label">Часы работы:</span>
          <span class="value">{{ place?.openingHours }}</span>
        </div>
        <div class="info-item" v-if="place?.price">
          <span class="label">Стоимость:</span>
          <span class="value">{{ place?.price }}</span>
        </div>
        <div class="info-item" v-if="place?.phone">
          <span class="label">Телефон:</span>
          <a :href="`tel:${place?.phone}`" class="value link">{{ place?.phone }}</a>
        </div>
        <div class="info-item" v-if="place?.website">
          <span class="label">Сайт/соцсеть:</span>
          <a :href="place?.website" target="_blank" class="value link">{{ place?.website }}</a>
        </div>
        <div class="info-item" v-if="place?.location?.name">
          <span class="label">Адрес:</span>
          <a :href="`https://yandex.ru/maps/?ll=${place?.location?.coordinates?.[0]}%2C${place?.location?.coordinates?.[1]}&z=16&pt=${place?.location?.coordinates?.[0]},${place?.location?.coordinates?.[1]}}`"
             target="_blank" class="value link">
            {{ place?.location?.name }}
          </a>
        </div>
        <div class="info-item" v-if="place?.location?.coordinates?.length">
          <span class="label">Координаты:</span>
          <span class="value">{{ place?.location?.coordinates?.join(', ') }}</span>
        </div>
      </div>

      <div class="description-full" v-if="place?.description">
        <h3>Описание</h3>
        <p v-html="place?.description"></p>
      </div>

      <div class="advices" v-if="place?.advicesForTourists">
        <h3>Советы туристам</h3>
        <div v-html="place?.advicesForTourists"></div>
      </div>

      <div class="trips-section" v-if="place?.trips?.length">
        <h3>Посещается в турах</h3>
        <div class="trips-list">
          <div 
            v-for="trip in place.trips" 
            :key="trip._id" 
            class="trip-item"
            @click="goToTrip(trip._id)"
          >
            {{ trip.name }}
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped lang="scss">
.place-card {
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 10px;
  object-fit: contain;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
}

.content {
  height: 100%;
  width: 100%;
  background: linear-gradient(to bottom, transparent, #484848);
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 16px 16px 16px;
}

.title {
  font-size: 26px;
  font-weight: 900;
  color: white;
  width: 100%;
  line-height: 1.1;
}

.category {
  font-size: 14px;
  color: white;
  opacity: 0.9;
  margin-bottom: 4px;
}

.description {
  font-size: 12px;
  color: white;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.place-modal {
  position: relative;

  h2 {
    font-weight: 900;
    margin-bottom: 8px;
  }

  .category {
    color: #666;
    margin-bottom: 16px;
  }
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  .mdi-close {
    font-size: 20px;
    color: #333;
  }
}

.info-grid {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  gap: 8px;

  .label {
    font-weight: 600;
    color: #333;
    min-width: 120px;
  }

  .value {
    color: #666;

    &.link {
      color: #239fca;
    }
  }
}

.description-full, .advices {
  margin-top: 20px;

  h3 {
    font-weight: 900;
    margin-bottom: 8px;
  }
}

.trips-section {
  margin-top: 20px;

  h3 {
    font-weight: 900;
    margin-bottom: 12px;
  }
}

.trips-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trip-item {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #239FCC;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #239FCC;
    color: white;
  }
}
</style>