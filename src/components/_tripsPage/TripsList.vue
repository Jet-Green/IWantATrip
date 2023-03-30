<script setup>
import { ref } from 'vue'

import { useScroll } from '@vueuse/core'

import { useTrips } from "../../stores/trips";
import TripListCard from "../cards/TripListCard.vue";

const tripStore = useTrips();

let scrollComponent = ref(null)
let scroll = useScroll(scrollComponent)

const loadMorePosts = () => {
  console.log('load');
}

</script>

<template>
  <div ref="scrollComponent">
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <a-row :gutter="[16, 16]" class="d-flex justify-center mt-8">
          <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="trip in tripStore.filteredTrips" :key="trip.index">
            <TripListCard :trip="trip" />
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

