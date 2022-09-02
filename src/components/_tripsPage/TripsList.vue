<script setup>
import { useData } from "../../stores/data";
import TripCard from "../cards/TripCard.vue";

const useDataStore = useData()
let trips = useDataStore.trips
</script>

<template>
  <a-row display="flex" justify="center">
    <a-col :xs="22" :lg="16">
      <a-row type="flex" justify="space-between">
        <a-col v-for="tour in trips" :key="index" :xs="24" :sm="11" :md="8" :xl="6">
          <TripCard :tour="tour" class="ma-8" />
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped>
</style>
