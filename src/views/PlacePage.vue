<script setup>
import { ref, onMounted, computed } from "vue";
import BackButtonAdaptive from "../components/BackButtonAdaptive.vue";
import { useRoute, useRouter } from "vue-router";
import { usePlaces } from "../stores/place";
import { useHead } from "@unhead/vue";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const place = ref({});
const route = useRoute();
const router = useRouter()
const placeStore = usePlaces();
const _id = route.query._id;
let backRoute = { name: 'Places', hash: `#${_id}` };
const hasHistory = computed(() => window.history.length > 1);

useHead(computed(() => ({
  title: place.value?.name,
  meta: [
    {
      name: "description",
      content: place.value?.shortDescription,
    },
    {
      property: "og:title",
      content: place.value?.name,
    },
    {
      name: "og:description",
      content: place.value?.shortDescription,
    },
    {
      name: "og:image",
      content: place.value?.images?.[0],
    },
    {
      name: "og:url",
      content: `${VITE_API_URL}/place?_id=${place.value?._id}`,
    },
  ],
  link: [{ rel: "canonical", href: `${VITE_API_URL}/place?_id=${place.value?._id}` }],
})));

onMounted(async () => {
  if (_id) {
    const res = await placeStore.getById(_id);
    place.value = res.data;
  }
});

function goToTrip(tripId) {
  router.push(`/trip?_id=${tripId}&history=true`)
}
</script>
<template>
  <div style="overflow-x: hidden">
    <a-row type="flex" justify="center" v-if="place?._id">
      <a-col :xs="22" :md="20" :xl="18">
        <BackButtonAdaptive :backRoute="hasHistory ? null : backRoute" />

        <div class="place-page">
          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :lg="10">
              <a-carousel arrows dots-class="slick-dots slick-thumb" v-if="place?.images?.length">
                <div v-for="(img, index) in place.images" :key="index">
                  <img :src="img" style="width: 100%; aspect-ratio: 16/9; object-fit: cover;" />
                </div>
              </a-carousel>
            </a-col>
            
            <a-col :xs="24" :lg="14">
              <h2 class="place-title">{{ place?.name }}</h2>
              <p class="place-category">{{ place?.category }}</p>

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
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>

    <a-row v-else type="flex" justify="center" style="margin-top: 50px;">
      <a-col>
        <a-spin size="large" />
      </a-col>
    </a-row>
  </div>
</template>

<style scoped lang="scss">
.place-page {
  margin-top: 20px;
}

.place-title {
  font-weight: 900;
  margin-bottom: 8px;
}

.place-category {
  color: #666;
  margin-bottom: 20px;
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
  margin-top: 24px;

  h3 {
    font-weight: 900;
    margin-bottom: 8px;
  }
}

.trips-section {
  margin-top: 24px;

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