<script setup>
import {ref} from 'vue'
import TripFilter from "../components/sections/TripFilter.vue";
import TripsList from "../components/_tripsPage/TripsList.vue";
import BackButton from "../components/BackButton.vue";
import { useTrips } from "../stores/trips";

const tripStore = useTrips()


let trips=ref([])

function findTrip(nameTrip){
  let k=0
  let t = []
  while(k<tripStore.trips.length){
    if (tripStore.trips[k].name.toLowerCase().includes(nameTrip.toLowerCase())) {
      t.push(tripStore.trips[k])
    }
    k++
  }
  trips.value = t
}

</script>
<template>
  <div>
    <BackButton />
    <TripFilter @inputName="findTrip" />
    <TripsList :trips="trips"/>
    
  </div>
</template>
