<script setup>
import { onMounted, ref } from 'vue'
import { useAuth } from "../../stores/auth";
import { useCompanions } from '../../stores/companions';

const userStore = useAuth()
const companionStore = useCompanions()

// let trips = ref([])
// const companionRequests = userStore.user.companionRequests

onMounted(async () => {
  // for (let _id of companionRequests) {
  //   const { data } = await companionStore.getById(_id)
  //   trips.value.push(data)
  // }
})
</script>
<template>
  <div>
    <a-row>
    <a-col :span="24">
      <a-row class="table_header">
        <a-col :md="8" :xs="4">тур</a-col>
        <a-col :md="8" :xs="12">корзина</a-col>
        <a-col :md="8" v-if="!sm">оплачено</a-col>

      </a-row>

      <a-row
        v-for="(trip, index) of userStore.user.boughtTrips"
        :key="index"
        class="mt-4 pa-8"
        :class="[index % 2 ? 'odd' : 'even']"
      >
        <a-col :md="8" :xs="4">
          {{ trip.tripId }}
        </a-col>
        <a-col :md="8" :xs="12" >{{ trip.cart }}</a-col>
        <a-col :md="8" v-if="!sm">{{ trip.isBoughtNow }}</a-col>

     
      </a-row>
    </a-col>
  </a-row>
  </div>
</template>
