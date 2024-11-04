<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useAuth } from "../../stores/auth";
import { usePlaces } from "../../stores/place"
import MyPlaceCard from './MyPlaceCard.vue';





const router = useRouter()
const route = useRoute();
const userStore = useAuth();
const placeStore = usePlaces()

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


async function refreshPlaces() {
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
})
</script>
<template>
  <div>

    <div style="display: flex; justify-content:space-between; flex-wrap:wrap" class="pa-8">
      <div>
        <a-button class="btn_light ma-8" @click="router.push('/create-place')">
          создать место
        </a-button>
      </div>

      <div>
        <a-input v-model:value="search" placeholder="поиск" style="width:180px" allow-clear />
      </div>

    </div>
    <a-row :gutter="[8, 8]">
      <a-col v-for="place in places" :span="24" :sm="12" :lg="8">

        <MyPlaceCard @refreshPlaces="refreshPlaces()" :place="place">
        </MyPlaceCard>

      </a-col>
    </a-row>
  </div>
</template>