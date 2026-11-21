<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../stores/auth'
import RentalService, { rentalPrice, pickupLabel } from '../service/RentalService'
import BackButton from '../components/BackButton.vue'
const imageFailed = ref(false)
const auth = useAuth()
const route = useRoute(), listing = ref(null), loading = ref(false), error = ref('')
const bookingUrl = computed(() => {
  const params = new URLSearchParams({ listingId: listing.value?.id || '' })
  if (auth.isAuth) params.set('continue', 'gorodaivesi')
  for (const key of ['dateFrom', 'dateTo', 'unitsNeeded']) if (typeof route.query[key] === 'string' && route.query[key]) params.set(key, route.query[key])
  return `https://rent.gorodaivesi.ru/auth/gorodaivesi?${params}`
})
let requestId = 0
async function load() {
  const current = ++requestId; loading.value = true; error.value = ''; listing.value = null; imageFailed.value = false
  try { const { data } = await RentalService.listing(route.params.id); if (current === requestId) listing.value = data.listing }
  catch (err) { if (current === requestId) error.value = err.response?.status === 404 ? 'Объект больше не доступен для аренды.' : 'Не удалось загрузить объект. Попробуйте ещё раз.' }
  finally { if (current === requestId) loading.value = false }
}
watch(() => route.params.id, load, { immediate: true })
</script>
<template>
  <div class="rental-listing" :aria-busy="loading">
    <BackButton :backRoute="{ name: 'RentalCatalog', query: route.query }" />
    <a-row justify="center">
      <a-col :xs="22" :xl="16">
        <div v-if="loading" class="rental-listing__state" role="status">
          <a-spin size="large" />
          <p>Загружаем объект…</p>
        </div>
        <div v-else-if="error || !listing" class="rental-listing__state" role="alert">
          <h1 class="rental-listing__title">{{ error || 'Объект не найден.' }}</h1>
          <a-button type="primary" class="lets_go_btn" @click="load">Повторить</a-button>
        </div>
        <template v-else>
          <h1 class="rental-listing__title">{{ listing.title }}</h1>
          <a-row :gutter="[12, 24]" class="text">
            <a-col :xs="24" :md="12">
              <img v-if="listing.photo && !imageFailed" class="rental-listing__image" :src="listing.photo" :alt="listing.title" @error="imageFailed = true">
              <div v-else class="rental-listing__no-photo">
                <MdiIcon name="image-outline" size="40px" aria-hidden="true" />
                <span>Фото пока нет</span>
              </div>
            </a-col>
            <a-col :xs="24" :md="12">
              <aside class="rental-listing__booking" aria-label="Условия аренды">
                <div class="rental-listing__action">
                  <p class="rental-listing__price"><b>{{ rentalPrice(listing.pricePerDay) }}</b><span> / сутки</span></p>
                  <a-button type="primary" class="lets_go_btn" :href="bookingUrl">Забронировать</a-button>
                </div>
                <dl class="rental-listing__terms">
                  <div><dt>Минимальный срок:</dt><dd>{{ listing.minRentalDays }} сут.</dd></div>
                  <div><dt>Количество:</dt><dd>{{ listing.availableUnits }} шт.</dd></div>
                </dl>
                <div v-for="method in listing.pickupMethods" :key="method" class="rental-listing__pickup">
                  <b>{{ pickupLabel(method) }}</b>
                  <p v-if="method === 'self_pickup' ? listing.pickupAddress : listing.deliveryZone">{{ method === 'self_pickup' ? listing.pickupAddress : listing.deliveryZone }}</p>
                </div>
                <p class="rental-listing__note">Оформление брони — на площадке аренды.</p>
              </aside>
            </a-col>
            <a-col v-if="listing.description" :span="24">
              <p class="rental-listing__description">{{ listing.description }}</p>
            </a-col>
          </a-row>
        </template>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped lang="scss">
.rental-listing {
  padding-bottom: 64px;
  overflow-wrap: anywhere;

  &__title {
    margin: 0 0 20px;
    font-size: clamp(1.5rem, 1.1975rem + 0.6303vw, 1.875rem);
    line-height: 1.3;
  }

  &__image,
  &__no-photo {
    display: block;
    width: 100%;
    aspect-ratio: 270 / 175;
    object-fit: cover;
  }

  &__no-photo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    background: #f1efe4;
    color: #6b665b;
    font-size: 14px;
  }

  &__booking {
    padding: 24px;
    border: 1px solid #e5e0cb;
    border-radius: 15px;
    background: #fff;
  }
  &__price { margin: 0 0 12px; line-height: 1.3; }
  &__price b { font-size: 1.6em; }
  &__price span { white-space: nowrap; }
  &__terms { margin: 0 0 16px; }
  &__terms > div { display: flex; flex-wrap: wrap; gap: 0 6px; }
  &__terms dt { font-weight: normal; }
  &__terms dd { margin: 0; font-weight: bold; }
  &__pickup { margin-bottom: 12px; }
  &__pickup p { margin: 0; }
  &__action { margin-bottom: 24px; }
  &__action .ant-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: auto;
    min-height: 48px;
    padding: 10px 16px;
    border-color: #ff6600;
    font-size: 16px;
    font-weight: 600;
    white-space: normal;
  }
  &__action .ant-btn:hover { background: #e65c00; border-color: #e65c00; transform: none; }
  &__action .ant-btn:focus-visible { outline: 3px solid #239fca; outline-offset: 3px; }
  &__note { margin: 16px 0 0; padding-top: 16px; border-top: 1px solid #e5e0cb; font-size: 14px; }
  &__description { margin: 0; white-space: pre-wrap; }
  &__state { padding: 40px 0; text-align: center; }
  &__state p { margin: 16px 0; }

  @media (max-width: 767px) {
    padding-bottom: calc(148px + env(safe-area-inset-bottom, 0px));

    &__booking { padding: 16px; }
    &__action {
      position: fixed;
      z-index: 20;
      right: 0;
      bottom: 0;
      left: 0;
      margin: 0;
      padding: 12px max(16px, env(safe-area-inset-right, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px));
      border-top: 1px solid #e5e0cb;
      background: #fffef4;
      box-shadow: 0 -4px 16px rgba(0, 0, 0, .06);
    }
    &__price { margin-bottom: 8px; font-size: 16px; }
    &__price b { font-size: 24px; }
  }
}
</style>
