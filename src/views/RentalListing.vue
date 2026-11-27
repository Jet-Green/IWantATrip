<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../stores/auth'
import RentalService, { rentalPrice, pickupLabel } from '../service/RentalService'
import BackButton from '../components/BackButton.vue'
const imageFailed = ref(false)
const auth = useAuth()
const route = useRoute(), listing = ref(null), loading = ref(false), error = ref('')
// Keep the selected period together, and only display real calendar dates.
function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}
const selectedPeriod = computed(() => {
  const { dateFrom, dateTo } = route.query
  if (!validDate(dateFrom) || !validDate(dateTo) || dateFrom >= dateTo) return null
  const format = value => value.split('-').reverse().join('.')
  return { from: format(dateFrom), to: format(dateTo) }
})
const requestedUnits = computed(() => {
  const value = route.query.unitsNeeded
  return typeof value === 'string' && /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : null
})
const descriptionParagraphs = computed(() => (listing.value?.description || '').split(/\n\s*\n/).map(text => text.trim()).filter(Boolean))
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
          <div class="rental-listing__layout">
            <div class="rental-listing__content">
              <div class="rental-listing__photo-stage">
                <img v-if="listing.photo && !imageFailed" class="rental-listing__image" :src="listing.photo" :alt="listing.title" @error="imageFailed = true">
                <div v-else class="rental-listing__no-photo">
                  <MdiIcon name="image-outline" size="40px" aria-hidden="true" />
                  <span>Фото пока нет</span>
                </div>
              </div>
              <section v-if="descriptionParagraphs.length" class="rental-listing__section" aria-labelledby="rental-description">
                <h2 id="rental-description">Описание</h2>
                <p v-for="(paragraph, index) in descriptionParagraphs" :key="index" class="rental-listing__description">{{ paragraph }}</p>
              </section>
              <section v-if="listing.pickupMethods?.length" class="rental-listing__section" aria-labelledby="rental-pickup">
                <h2 id="rental-pickup">Получение</h2>
                <div v-for="method in listing.pickupMethods" :key="method" class="rental-listing__pickup">
                  <MdiIcon :name="method === 'self_pickup' ? 'map-marker-outline' : 'truck-outline'" size="22px" aria-hidden="true" />
                  <div>
                    <h3>{{ pickupLabel(method) }}</h3>
                    <p v-if="method === 'self_pickup' ? listing.pickupAddress : listing.deliveryZone">{{ method === 'self_pickup' ? listing.pickupAddress : listing.deliveryZone }}</p>
                  </div>
                </div>
              </section>
            </div>
            <aside class="rental-listing__booking" aria-label="Условия аренды">
              <div class="rental-listing__action">
                <p class="rental-listing__price"><b>{{ rentalPrice(listing.pricePerDay) }}</b><span> / сутки</span></p>
                <a-button type="primary" class="lets_go_btn" :href="bookingUrl">Забронировать</a-button>
              </div>
              <div v-if="selectedPeriod || requestedUnits" class="rental-listing__selection">
                <h2>Ваш выбор</h2>
                <dl>
                  <div v-if="selectedPeriod" class="rental-listing__dates"><dt>Период аренды</dt><dd>{{ selectedPeriod.from }} <span aria-hidden="true">—</span><span class="rental-listing__sr-only">по</span> {{ selectedPeriod.to }}</dd></div>
                  <div v-if="requestedUnits"><dt>Нужно</dt><dd>{{ requestedUnits }} шт.</dd></div>
                </dl>
              </div>
              <dl class="rental-listing__terms">
                <div><dt>Минимальный срок</dt><dd>{{ listing.minRentalDays }} сут.</dd></div>
                <div><dt>Доступно</dt><dd>{{ listing.availableUnits }} шт.</dd></div>
              </dl>
              <p class="rental-listing__note">Оформление брони — на площадке аренды.</p>
            </aside>
          </div>
        </template>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped lang="scss">
.rental-listing {
  padding-bottom: 64px;
  color: #28271f;
  font-family: 'Montserrat', sans-serif;
  overflow-wrap: anywhere;

  &__title { margin: 0 0 24px; font-size: clamp(24px, 2.6vw, 36px); font-weight: 700; line-height: 1.25; }
  &__layout { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(300px, .85fr); align-items: start; gap: 32px; }
  &__content { min-width: 0; }
  &__photo-stage { display: flex; align-items: center; justify-content: center; height: clamp(280px, 34vw, 440px); overflow: hidden; border: 1px solid #eee9da; border-radius: 16px; background: #f4f1e8; }
  &__image { display: block; width: 100%; height: 100%; object-fit: contain; }
  &__no-photo { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; width: 100%; height: 100%; color: #716d62; font-size: 14px; }
  &__section { margin-top: 32px; }
  &__section h2, &__selection h2 { margin: 0 0 16px; font-size: 20px; line-height: 1.4; font-weight: 700; }
  &__description { margin: 0 0 16px; white-space: pre-wrap; font-size: 16px; line-height: 1.75; }
  &__pickup { display: flex; align-items: flex-start; gap: 12px; padding: 18px 0; border-bottom: 1px solid #e9e4d5; }
  &__pickup:last-child { border-bottom: 0; }
  &__pickup > :first-child { flex-shrink: 0; margin-top: 2px; color: #239fca; }
  &__pickup h3 { margin: 0 0 4px; font-size: 16px; font-weight: 600; }
  &__pickup p { margin: 0; font-size: 15px; line-height: 1.6; color: #625f55; white-space: pre-wrap; }
  &__booking { padding: 24px; border: 1px solid #e5e0cb; border-radius: 16px; background: #fff; }
  &__price { margin: 0 0 16px; line-height: 1.3; }
  &__price b { font-size: 30px; font-weight: 700; }
  &__price span { white-space: nowrap; font-size: 14px; color: #625f55; }
  &__selection { margin-bottom: 20px; padding: 18px; border-radius: 12px; border: 1px solid #e5e0cb; background: #f7f5ec; }
  &__selection h2 { margin-bottom: 12px; font-size: 16px; }
  &__selection dl, &__terms { margin: 0; }
  &__selection dl > div, &__terms > div { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; font-size: 14px; line-height: 1.5; }
  &__selection dl > .rental-listing__dates { display: block; }
  &__dates dd { margin-top: 4px; }
  &__selection dt, &__terms dt { font-weight: 400; color: #625f55; }
  &__selection dd, &__terms dd { flex-shrink: 0; margin: 0; font-weight: 600; }
  &__action { margin-bottom: 24px; }
  &__action .ant-btn { display: flex; align-items: center; justify-content: center; width: 100%; height: auto; min-height: 50px; padding: 12px 16px; border-color: #ff6600; border-radius: 15px; background: #ff6600; color: #fff; font-size: 16px; font-weight: 600; white-space: normal; }
  &__action .ant-btn:hover { background: #e65c00; border-color: #e65c00; transform: none; }
  &__action .ant-btn:focus-visible { outline: 3px solid #239fca; outline-offset: 3px; }
  &__note { margin: 16px 0 0; padding-top: 16px; border-top: 1px solid #e5e0cb; color: #625f55; font-size: 13px; line-height: 1.6; }
  &__state { padding: 40px 16px; border-radius: 16px; background: #f4f1e8; text-align: center; }
  &__state .rental-listing__title { font-size: 22px; }
  &__state p { margin: 16px 0; }
  &__sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }

  @media (max-width: 767px) {
    padding-bottom: calc(156px + env(safe-area-inset-bottom, 0px));
    &__title { margin-bottom: 20px; font-size: 26px; }
    &__layout { display: flex; flex-direction: column; gap: 24px; }
    &__content, &__booking { width: 100%; }
    &__photo-stage { height: clamp(220px, 72vw, 340px); }
    &__section { margin-top: 24px; }
    &__section h2 { font-size: 20px; }
    &__booking { padding: 20px; }
    &__action { position: fixed; z-index: 20; right: 0; bottom: 0; left: 0; margin: 0; padding: 12px max(16px, env(safe-area-inset-right, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px)); border-top: 1px solid #e5e0cb; background: #fffef4; box-shadow: 0 -4px 16px rgba(0, 0, 0, .06); }
    &__price { margin-bottom: 8px; }
    &__price b { font-size: 24px; }
    &__selection { padding: 16px; }
    &__terms > div { flex-wrap: wrap; }
  }
}
</style>
