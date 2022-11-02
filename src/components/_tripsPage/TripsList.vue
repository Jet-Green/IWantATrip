<script setup>
import { computed } from "vue";
import { useTrips } from "../../stores/trips";
import TripListCard from "../cards/TripListCard.vue";

const useTripsStore = useTrips();
let trips = computed(() => {
  return useTripsStore.trips;
});

</script>

<template>
  <a-row display="flex" justify="center" class="mt-16" >
    <a-col :sm="20">
      <a-row display="flex" justify="center" :gutter="[16,16]" class="pa-4" style="align-items: flex-end">
        <a-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          v-for="trip in trips"
          :key="trip.index"
        >
          <TripListCard :trip="trip" style="width: 100%" />
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped>
</style>
