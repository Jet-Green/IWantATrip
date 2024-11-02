<script setup>
import { onMounted, ref } from "vue"
import { usePlaces } from "../../../stores/place"
import { useRouter } from "vue-router"

const placeStore = usePlaces()
let placesRejected = ref([])
let router = useRouter()

let page =  1 
let query = {isModerated:false, isRejected:true}

async function deletePlace(_id) {

  await placeStore.deletePlace (_id)
  await refreshPlacesOnModeration()
}

async function refreshPlacesOnModeration() {
  let  data  = await placeStore.getAll(page, query)
 placesRejected.value = data
}

onMounted(async () => {
  await refreshPlacesOnModeration()
})
</script>
<template>

  <a-row :gutter="[8, 8]" class="mt-8">
    <a-col
      :lg="8"
      :sm="12"
      :xs="24"
      v-if="placesRejected.length > 0"
      v-for="(place, index) of placesRejected"
      :key="index"
    >
      <a-card class="card" hoverable>
        <div style="text-align: center">
          {{ place.name }}
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
          <span
            class="mdi mdi-check-decagram-outline"
            @click="router.push(`/moderate-place?_id=${place._id}`)"
            style="color: #245159; cursor: pointer"
          ></span>
        </div>
      </a-card>
    </a-col>
    <a-col :span="24" v-else> Нет мест на модерации </a-col>
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
</style>
