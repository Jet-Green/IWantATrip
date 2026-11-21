<script setup>
import { ref, watch } from 'vue'
import { rentalPrice, pickupLabel } from '../../service/RentalService'
const props = defineProps({ listing: Object, query: Object })
const imageFailed = ref(false)
watch(() => props.listing.photo, () => { imageFailed.value = false })
</script>
<template>
  <router-link class="rental-catalog-card" :title="listing.title" :to="{ name: 'RentalListing', params: { id: listing.id }, query }">
    <a-badge-ribbon :text="`${rentalPrice(listing.pricePerDay)} / сутки`" placement="end">
      <div class="rental-catalog-card__picture">
        <img v-if="listing.photo && !imageFailed" :src="listing.photo" alt="" loading="lazy" @error="imageFailed = true" />
        <div class="rental-catalog-card__content">
          <h2>{{ listing.title }}</h2>
          <p>От {{ listing.minRentalDays }} сут. · {{ listing.availableUnits }} шт.</p>
          <p v-if="listing.pickupMethods?.length" class="rental-catalog-card__pickup">{{ listing.pickupMethods.map(pickupLabel).join(' · ') }}</p>
        </div>
      </div>
    </a-badge-ribbon>
  </router-link>
</template>
<style lang="scss" scoped>
.rental-catalog-card { display: block; width: 100%; min-width: 0; color: white; border-radius: 10px; }
.rental-catalog-card:focus-visible { outline: 3px solid #ff6600; outline-offset: 3px; }
.rental-catalog-card__picture { position: relative; isolation: isolate; display: flex; align-items: flex-end; width: 100%; min-height: 160px; aspect-ratio: 270 / 175; border-radius: 10px; overflow: hidden; background: #484848; }
.rental-catalog-card__picture > img { position: absolute; z-index: -1; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.rental-catalog-card__content { width: 100%; padding: 26px 16px 14px; background: linear-gradient(to bottom, transparent, #484848); color: white; overflow-wrap: anywhere; }
.rental-catalog-card__content h2 { margin: 0; font-size: clamp(1rem, .6023rem + 1.1364vw, 1.3rem); font-weight: 900; line-height: 1.3; color: inherit; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
.rental-catalog-card__content p { margin: 4px 0 0; font-size: 13px; line-height: 1.4; color: inherit; }
.rental-catalog-card__pickup { opacity: .9; }
</style>
