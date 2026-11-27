<script setup>
import { ref, watch } from 'vue'
import { rentalPrice, pickupLabel } from '../../service/RentalService'
const props = defineProps({ listing: Object, query: Object })
const imageFailed = ref(false)
watch(() => props.listing.photo, () => { imageFailed.value = false })
</script>
<template>
  <router-link class="rental-catalog-card" :title="listing.title" :to="{ name: 'RentalListing', params: { id: listing.id }, query }">
    <div class="rental-catalog-card__picture">
      <img v-if="listing.photo && !imageFailed" :src="listing.photo" alt="" loading="lazy" @error="imageFailed = true" />
      <div v-else class="rental-catalog-card__no-photo"><MdiIcon name="image-outline" /><span>Фото пока нет</span></div>
    </div>
    <div class="rental-catalog-card__content">
      <h2>{{ listing.title }}</h2>
      <p class="rental-catalog-card__specs">От {{ listing.minRentalDays }} сут. · {{ listing.availableUnits }} шт.</p>
      <p v-if="listing.pickupMethods?.length" class="rental-catalog-card__pickup">{{ listing.pickupMethods.map(pickupLabel).join(' · ') }}</p>
      <p class="rental-catalog-card__price"><strong>{{ rentalPrice(listing.pricePerDay) }}</strong><span> / сутки</span></p>
    </div>
  </router-link>
</template>
<style lang="scss" scoped>
.rental-catalog-card { display: flex; flex-direction: column; width: 100%; min-width: 0; background: #fff; color: #252522; border-radius: 18px; overflow: hidden; border: 1px solid #eceae5; transition: border-color .18s ease; }
.rental-catalog-card:hover { color: #252522; border-color: #b9b5ac; }
.rental-catalog-card:focus-visible { outline: 3px solid #ff6600; outline-offset: 3px; }
.rental-catalog-card__picture { position: relative; width: 100%; aspect-ratio: 4 / 3; overflow: hidden; background: #efeee9; }
.rental-catalog-card__picture > img { width: 100%; height: 100%; object-fit: cover; }
.rental-catalog-card__no-photo { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; height: 100%; color: #79776e; font-size: 13px; }
.rental-catalog-card__no-photo :deep(svg) { width: 32px; height: 32px; }
.rental-catalog-card__content { display: flex; flex: 1; flex-direction: column; padding: 18px; overflow-wrap: anywhere; }
.rental-catalog-card__content h2 { margin: 0 0 8px; font-size: 18px; font-weight: 800; line-height: 1.4; color: inherit; }
.rental-catalog-card__content p { margin: 0; font-size: 13px; line-height: 1.6; }
.rental-catalog-card__specs, .rental-catalog-card__pickup { color: #66635d; }
.rental-catalog-card__content .rental-catalog-card__price { margin-top: auto; padding-top: 18px; color: #252522; }
.rental-catalog-card__price strong { font-size: 21px; font-weight: 800; }
.rental-catalog-card__price span { color: #66635d; }
@media (prefers-reduced-motion: reduce) { .rental-catalog-card { transition: none; } }
</style>
