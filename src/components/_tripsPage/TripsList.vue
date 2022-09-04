<script setup>
import { useTrips } from "../../stores/trips";
import TripCard from "../cards/TripCard.vue";

const useTripsStore = useTrips()
let trips = useTripsStore.trips;
</script>

<template>
  <a-row display="flex" justify="center">
    <a-col :xs="22" :lg="16">
      <a-row type="flex" justify="space-between">
        <a-col v-for="trip in trips" :xs="24" :sm="11" :md="8" :xl="6">
          <TripCard :trip="trip" class="ma-8" />
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped>
</style>
