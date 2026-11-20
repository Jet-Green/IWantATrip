<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import RentalService, { rentalPrice, pickupLabel } from '../service/RentalService'
import '../assets/rental.scss'
const route = useRoute(), listing = ref(null), loading = ref(false), error = ref('')
const bookingUrl = computed(() => {
  const params = new URLSearchParams({ listingId: listing.value?.id || '' })
  for (const key of ['dateFrom', 'dateTo', 'unitsNeeded']) if (typeof route.query[key] === 'string' && route.query[key]) params.set(key, route.query[key])
  return `https://rent.gorodaivesi.ru/auth/gorodaivesi?${params}`
})
let requestId = 0
async function load() {
  const current = ++requestId; loading.value = true; error.value = ''; listing.value = null
  try { const { data } = await RentalService.listing(route.params.id); if (current === requestId) listing.value = data.listing }
  catch (err) { if (current === requestId) error.value = err.response?.status === 404 ? 'Объект больше не доступен для аренды.' : 'Не удалось загрузить объект. Попробуйте ещё раз.' }
  finally { if (current === requestId) loading.value = false }
}
watch(() => route.params.id, load, { immediate: true })
</script>
<template>
  <div class="rental-page" :aria-busy="loading">
    <router-link class="rental-back" :to="{ name: 'RentalCatalog', query: route.query }">← К объектам аренды</router-link>
    <p v-if="loading" role="status" class="rental-state">Загружаем объект…</p>
    <div v-else-if="error" role="alert" class="rental-state"><h1>{{ error }}</h1><button class="rental-button" @click="load">Повторить</button></div>
    <template v-else-if="listing">
      <h1>{{ listing.title }}</h1>
      <div class="rental-detail">
        <div><img v-if="listing.photo" class="rental-detail__image" :src="listing.photo" :alt="listing.title" @error="event => event.target.hidden = true"><p class="rental-description">{{ listing.description }}</p></div>
        <aside class="rental-booking" aria-label="Условия аренды">
          <strong class="rental-booking__price">{{ rentalPrice(listing.pricePerDay) }} / сутки</strong>
          <p>Минимальный срок: {{ listing.minRentalDays }} сут.</p><p>Количество: {{ listing.availableUnits }} шт.</p>
          <div v-for="method in listing.pickupMethods" :key="method"><strong>{{ pickupLabel(method) }}</strong><p>{{ method === 'self_pickup' ? listing.pickupAddress : listing.deliveryZone }}</p></div>
          <a class="rental-button" :href="bookingUrl">Забронировать</a>
          <p>Продолжите на площадке аренды: проверьте даты и количество, затем оформите бронь.</p>
        </aside>
      </div>
    </template>
  </div>
</template>
