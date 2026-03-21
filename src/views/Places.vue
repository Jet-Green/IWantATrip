<script setup>
import { onMounted, reactive, ref, watch, computed, nextTick } from "vue";
import BackButtonAdaptive from "../components/BackButtonAdaptive.vue"
import PlaceCard from "../components/cards/PlaceCard.vue"

import PlaceFilter from "../components/_guide/PlaceFilter.vue";
import { usePlaces } from "../stores/place";
import { useHead } from "@unhead/vue";
const API_URL = import.meta.env.VITE_API_URL
useHead(computed(() => ({
  title: "Места: города и веси",
  meta: [
    {
      name: "description",
      content: 'Парк, кафе, музей, театр, ресторан, бассейн, клуб - лучшие места России, Удмуртии',
    },
    {
      property: "og:title",
      content: 'Места: города и веси',
    },
    {
      name: "og:description",
      content: 'Парк, кафе, музей, театр, ресторан, бассейн, клуб - лучшие места России, Удмуртии',
    },


    {
      name: "og:url",
      content: `${API_URL}/places`,
    },
  ],
  link: [{ rel: "canonical", href: `${API_URL}/places` }],
})));




const placeStore = usePlaces();
let showMoreButton = ref(true)
let page = 1
let isLoading = ref(false)


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


let postersLength = 0

let morePlaces = async () => {
  page++
  let res = await placeStore.getAll(page, query)

  if (res.length == postersLength) {
    showMoreButton.value = false
  }
  postersLength = res.length

}
let refreshPlaces = async () => {
  isLoading.value = true
  page = 1
  postersLength = 0
  await placeStore.getAll(page, query)
  if (placeStore.places.length < 20) {
    showMoreButton.value = false
  } else {
    showMoreButton.value = true
  }
  isLoading.value = false

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
    <a-row type="flex" justify="center">
      <a-col :xs="22" :md="20" :xl="18">
        <BackButtonAdaptive :backRoute="backRoute" />

        <h2 class="title">Места</h2>
        <PlaceFilter @refreshPlaces=refreshPlaces />

        <a-spin v-if="isLoading" size="large" style="display: flex; justify-content: center; margin: 40px 0;" />

        <a-row v-else :gutter="[12, 16]">
          <a-col :span="24" :sm="12" :md="8" :xl="6" v-for="place in placeStore.places" :key="place._id">
            <PlaceCard :place="place" />
          </a-col>
        </a-row>

        <a-row v-if="!placeStore.places.length && !isLoading">
          <a-col :span="24">
            <h3 style="text-align: center;">Места не найдены!</h3>
          </a-col>
        </a-row>

        <div class="justify-center d-flex ma-16" @click="morePlaces()" v-if="showMoreButton && !isLoading">
          <a-button>Ещё</a-button>
        </div>

      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.title {
  font-weight: 900;
}
</style>
