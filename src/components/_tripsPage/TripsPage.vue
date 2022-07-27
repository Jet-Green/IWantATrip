<script setup>
import { useRoute } from 'vue-router'

import SearchATrip from './SearchATrip.vue'
import TripsList from './TripsList.vue'
import TripInfo from './TripInfo.vue'
import BackButton from '../BackButton.vue'

let route = useRoute()
let withTripInfo;
// чтобы не слетала разметка после перезагрузки
try {
  withTripInfo = route.params.withTripInfo
} catch (err) {
  console.error(err);
}
</script>
<template>
  <BackButton />
  <!-- <TripInfo v-if="withTripInfo" /> -->
  <SearchATrip />
  <TripsList />
</template>
