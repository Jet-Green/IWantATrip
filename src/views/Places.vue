<script setup>
import { onMounted, ref } from "vue";
import BackButton from "../components/BackButton.vue"
import PlaceCard from "../components/cards/PlaceCard.vue"

import PlaceFilter from "../components/_guide/PlaceFilter.vue";
import { usePlaces } from "../stores/place";

const placeStore = usePlaces();
let showMoreButton = ref(true)
let filter = { sitePage: 1 }

let morePlaces = async () => {
  filter.sitePage++
  let res =  await placeStore.getAll(filter)
  console.log(res)
    if (!res.length) {
      showMoreButton.value = false
    } 

}

onMounted(async () => {
  await placeStore.getAll(filter)
})
const backRoute = { name: 'Landing', hash: '#guide' };
</script>
<template>
  <div style="overflow-x: hidden" id="top">
    <BackButton :backRoute="backRoute" />
    <a-row class="justify-center d-flex pb-64" >

      <a-col :xs="22" :xl="16">
        <h2>Места</h2>
        <PlaceFilter />

        <PlaceCard :place="place" v-for="place, index in placeStore.places" :key="index" />
        <div class="justify-center d-flex" @click="morePlaces()"> <a-button>Ещё</a-button></div>

      </a-col>
    </a-row>
  </div>
</template>
