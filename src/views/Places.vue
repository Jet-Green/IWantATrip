<script setup>
import { onMounted, reactive, ref, watch, computed } from "vue";
import BackButton from "../components/BackButton.vue"
import PlaceCard from "../components/cards/PlaceCard.vue"

import PlaceFilter from "../components/_guide/PlaceFilter.vue";
import { usePlaces } from "../stores/place";

const placeStore = usePlaces();
let showMoreButton = ref(true)
let page = 1


let conditions = computed(() => {
  const conditions = {};

  if (placeStore.filter.search) {
    conditions.name = placeStore.filter.search;
  }

  if (placeStore.filter.category) {
    conditions.category = placeStore.filter.category
  }
  if (placeStore.filter.location.coordinates.length) {
    conditions.location = placeStore.filter.location
             
  }
  if (placeStore.filter.locationRadius) {
    conditions.locationRadius = placeStore.filter.locationRadius
            
  }
 
  return Object.keys(conditions).length > 0 ? conditions : undefined;
})

let query = reactive({
  isModerated: true,
  isRejected: false,
  isHidden: false,
  conditions: conditions
})


let postersLenght = 0

let morePlaces = async () => {
  page++
  let res = await refreshPlaces()

  if (res.length == postersLenght) {
    showMoreButton.value = false
  }
  postersLenght = res.length

}
let refreshPlaces = async () => {

  page = 1
  await placeStore.getAll(page, query)
}



onMounted(async () => {

  await refreshPlaces()

  if (placeStore.places.length < 20) {
    showMoreButton.value = false
  }

})
const backRoute = { name: 'Landing', hash: '#guide' };
</script>
<template>
  <div style="overflow-x: hidden" id="top">
    <BackButton :backRoute="backRoute" />
    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16" >
        <h2>Места</h2>
        <PlaceFilter @refreshPlaces=refreshPlaces />
        <PlaceCard :place="place" v-for="place, index in placeStore.places" :key="index" style="margin-bottom: 16px;" />
        <div class="justify-center d-flex" @click="morePlaces()" v-if="showMoreButton"> <a-button>Ещё</a-button></div>

      </a-col>
    </a-row>
  </div>
</template>
