<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from "../../stores/auth"
import { useTracks } from "../../stores/track"
import MyTrackCard from './MyTrackCard.vue'

const router = useRouter()
const userStore = useAuth()
const trackStore = useTracks()

let showMoreButton = ref(true)
let tracks = ref([])
let search = ref('')
let page = 1
let query = {
  author: userStore.user._id,
  $or: [
    { title: { $regex: '', $options: 'i' } },
    { type: { $regex: '', $options: 'i' } }
  ]
}

let moreTracks = async () => {
  page++
  let res = await refreshTracks()

  if (res.length == tracksLength) {
    showMoreButton.value = false
  }
  tracksLength = res.length
}

async function refreshTracks() {
  page = 1
  let data = await trackStore.getAll(page, query)
  tracks.value = data
}

watch(search, (newSearch, oldSearch) => {
  if (newSearch.length > 2 || newSearch.length <= oldSearch.length) {
    query.$or[0].title.$regex = newSearch
    query.$or[1].type.$regex = newSearch
    refreshTracks()
  }
})

onMounted(async () => {
  await refreshTracks()
  if (trackStore.tracks.length < 20) {
    showMoreButton.value = false
  }
})
</script>

<template>
  <div>
    <div style="display: flex; justify-content:space-between; flex-wrap:wrap" class="pa-8">
      <div>
        <a-button class="btn_light ma-8" @click="router.push('/create-track')">
          создать маршрут
        </a-button>
      </div>

      <div>
        <a-input v-model:value="search" placeholder="поиск" style="width:180px" allow-clear />
      </div>
    </div>

    <a-row :gutter="[8, 8]">
      <a-col v-for="track in tracks" :key="track._id" :span="24" :sm="12" :lg="8">
        <MyTrackCard @refreshTracks="refreshTracks()" :track="track" />
      </a-col>
      <a-col :span="24" class="justify-center d-flex" @click="moreTracks()" v-if="showMoreButton">
        <a-button>Ещё</a-button>
      </a-col>
    </a-row>
  </div>
</template>
