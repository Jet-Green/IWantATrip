<script setup>
import { onMounted, ref, watch } from "vue"
import { usePlaces } from "../../../stores/place"
import { useRouter } from "vue-router"

const placeStore = usePlaces()
let places = ref([])
let router = useRouter()

let page = 1
let showMoreButton = ref(true)

let query = {
  isModerated: true,
  isRejected: false,
  name: { $regex: '', $options: 'i' }
}
let search = ref('')

async function deletePlace(_id) {

  await placeStore.deletePlace(_id)
  await refreshPlaces()
}

async function refreshPlaces() {
  let data = await placeStore.getAll(page, query)
  places.value = data
}

let morePlaces = async () => {
  page++
  let res = await placeStore.getAll(page, query)

  if (res.length == postersLength) {
    showMoreButton.value = false
  }
  postersLength = res.length

}
async function hidePlace(_id) {
  let response = await placeStore.hidePlace(_id);
  if (response.status == 200) {
    refreshPlaces()
  }
}
watch(search, (newSearch, oldSearch) => {

  if (newSearch.length > 2 || newSearch.length <= oldSearch.length) {
    query.name.$regex = newSearch
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


  <a-row>
    <a-col :sm="12" :xs="24">
      <a-input v-model:value="search" placeholder="поиск" allow-clear />
    </a-col>
  </a-row>

  <a-row :gutter="[8, 8]" class="mt-8">

    <a-col :lg="8" :sm="12" :xs="24" v-if="places?.length > 0" v-for="(place, index) of places" :key="index">
      <a-card class="card" hoverable style="height:100%" :class="[place.isHidden ? 'overlay' : '']">
        <div style="text-align: center">
          {{ place?.name }}
        </div>
        <a-divider class="ma-4" style="border-color: #205f79"></a-divider>
        <div>
          <span class="mdi mdi-compass-outline"></span>
          {{ place.dadataLocation?.name ? place.dadataLocation?.name : place.name }}
        </div>

        <div class="actions d-flex justify-center">
          <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="deletePlace(place._id)">
            <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
          </a-popconfirm>
          <a-popconfirm title="Скрыть/показать?" ok-text="Да" cancel-text="Нет" @confirm="hidePlace(place._id)">
            <span v-if="!place.isHidden" class="mdi mdi-eye-outline"></span>
            <span v-else class="mdi mdi-eye-off-outline"></span>
          </a-popconfirm>

          <span class="mdi mdi-pencil" @click="router.push(`/edit-place?_id=${place._id}&is_admin=${true}`)"
            style="color: #245159; cursor: pointer"></span>
        </div>
      </a-card>
    </a-col>
    <a-col :span="24" v-else> Ничего не нашли </a-col>
    <div class="justify-center d-flex ma-16" @click="morePlaces()" v-if="showMoreButton"> <a-button>Ещё</a-button>
    </div>
  </a-row>
</template>
<style scoped lang="scss">
.actions {
  font-size: 20px;
  position: relative;

  * {
    margin: 4px;
    cursor: pointer;
  }
}
.overlay {
  opacity: 0.5;
}
</style>
