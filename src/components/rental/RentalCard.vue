<script setup>
import RentalIcon from './RentalIcon.vue'
import { rentalPrice, pickupLabel } from '../../service/RentalService'
defineProps({ listing: Object, query: Object })
</script>
<template>
  <router-link class="rental-card" :to="{ name: 'RentalListing', params: { id: listing.id }, query }">
    <img v-if="listing.photo" :src="listing.photo" :alt="listing.title" loading="lazy" @error="event => event.target.hidden = true">
    <div v-else class="rental-card__placeholder" aria-hidden="true"><RentalIcon style="width: 80px" /></div>
    <div class="rental-card__body">
      <h2>{{ listing.title }}</h2>
      <strong>{{ rentalPrice(listing.pricePerDay) }} / сутки</strong>
      <p>От {{ listing.minRentalDays }} сут. · {{ listing.availableUnits }} шт.</p>
      <p>{{ listing.pickupMethods?.map(pickupLabel).join(' · ') }}</p>
      <span class="rental-card__more">Подробнее →</span>
    </div>
  </router-link>
</template>
