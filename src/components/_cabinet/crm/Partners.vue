<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useAuth } from "../../../stores/auth";
import { usePlaces } from "../../../stores/place"
// import PartnerCard from './PartnerCard.vue';





const router = useRouter()
const route = useRoute();
const userStore = useAuth();
const placeStore = usePlaces()

let showMoreButton = ref(true)
let places = ref([])
let search = ref('')
let page = 1
let query = {
  author: userStore.user._id,
  $or: [
    { name: { $regex: '', $options: 'i' } },
    { category: { $regex: '', $options: 'i' } }
  ]
};


let morePlaces = async () => {
  page++
  let res = await refreshPlaces()

  if (res.length == postersLenght) {
    showMoreButton.value = false
  }
  postersLenght = res.length

}


async function refreshPlaces() {
  page = 1
  let data = await placeStore.getAll(page, query)
  places.value = data
}

watch(search, (newSearch, oldSearch) => {

  if (newSearch.length > 2 || newSearch.length <= oldSearch.length) {
    query.$or[0].name.$regex = newSearch
    query.$or[1].category.$regex = newSearch
    refreshPlaces()
  }
})

onMounted(async () => {
  await refreshPlaces()
  if (placeStore.places.length < 20) {
    showMoreButton.value = false
  }
})
</script>
<template>
  <div>

    <div style="display: flex; justify-content:space-between; flex-wrap:wrap" class="pa-8">
      <div>
        <a-button class="btn_light ma-8" @click="router.push('/create-partner')">
          создать партнера
        </a-button>
      </div>

      <div>
        <a-input v-model:value="search" placeholder="поиск" style="width:180px" allow-clear />
      </div>

    </div>
    <a-row :gutter="[8, 8]">
      <a-col v-for="place in places" :span="24" :sm="12" :lg="8">

        <PartnerCard @refreshPlaces="refreshPlaces()" :place="place">
        </PartnerCard>

      </a-col>
      <a-col :span="24"  class="justify-center d-flex" @click="morePlaces()" v-if="showMoreButton"> <a-button>Ещё</a-button></a-col>
    </a-row>
  </div>
</template>