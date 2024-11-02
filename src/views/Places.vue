<script setup>
import { onMounted, ref } from "vue";
import BackButton from "../components/BackButton.vue"
import PlaceCard from "../components/cards/PlaceCard.vue"

import PlaceFilter from "../components/_guide/PlaceFilter.vue";
import { usePlaces } from "../stores/place";

const placeStore = usePlaces();
let showMoreButton = ref(true)
let page =  1 
let query = {isModerated:true, isRejected:false, isHidden:false}
let postersLenght = 0

let morePlaces = async () => {
  page++
  let res = await placeStore.getAll(page, query)

  if (res.length == postersLenght) {
    showMoreButton.value = false
  }
  postersLenght = res.length

}

onMounted(async () => {
  await placeStore.getAll(page, query)
  if (placeStore.places.length < 20) {
    showMoreButton.value = false
  }

})
const backRoute = { name: 'Landing', hash: '#guide' };
</script>
<template>
  <div style="overflow-x: hidden" id="top">
    <BackButton :backRoute="backRoute" />
    <a-row class="justify-center d-flex pb-64">

      <a-col :xs="22" :xl="16">
        <h2>Места</h2>
        <PlaceFilter />
        <PlaceCard :place="place" v-for="place, index in placeStore.places" :key="index" />
        <div class="justify-center d-flex" @click="morePlaces()" v-if="showMoreButton"> <a-button>Ещё</a-button></div>

      </a-col>
    </a-row>
  </div>
</template>
