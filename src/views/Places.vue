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
  const conditions = [];

  if (placeStore.filter.search) {
    conditions.push({ name: { $regex: placeStore.filter.search, $options: 'i' } });
  }

  if (placeStore.filter.category) {
    conditions.push({ category: placeStore.filter.category });
  }
  return conditions.length > 0 ? conditions : undefined;
})

let query = reactive({
  isModerated: true,
  isRejected: false,
  isHidden: false,
  $and: conditions
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

// watch(placeStore.filter, (newFilter, oldFilter) => {
//   query.$and[0].name.$regex = newFilter.search
//   query.$and[1].category = newFilter.category
// }
// )



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
    <a-row class="justify-center d-flex pb-64">
      <a-col :xs="22" :xl="16">
        <h2>Места</h2>
        <PlaceFilter @refreshPlaces=refreshPlaces />

        <PlaceCard :place="place" v-for="place, index in placeStore.places" :key="index" />
        <div class="justify-center d-flex" @click="morePlaces()" v-if="showMoreButton"> <a-button>Ещё</a-button></div>

      </a-col>
    </a-row>
  </div>
</template>
