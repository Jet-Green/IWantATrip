<script setup>
import { onMounted, ref } from "vue"
import { usePlaces } from "../../../stores/place"
import { useRouter } from "vue-router"

const placeStore = usePlaces()
let placesOnModeration = ref([])
let router = useRouter()

async function tripToDelete(_id) {
  await tripStore.deleteById(_id)
  await refreshPlacesOnModeration()
}
const clearData = (dataString) => {
  let date
  dataString = String(dataString)
  if (dataString.length == 13) {
    const dataFromString = new Date(Number(dataString))
    date = dataFromString
  } else {
    date = new Date(dataString)
  }
  return date.toLocaleDateString("ru-Ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  })
}
async function refreshPlacesOnModeration() {
  let { data } = await placeStore.getPlacesForModeration("on-moderation")
  placesOnModeration.value = data
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
      v-if="placesOnModeration.length > 0"
      v-for="(place, index) of placesOnModeration"
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
        <!-- <div>
          <span class="mdi mdi-calendar-arrow-right"></span>
          {{ `c ${clearData(place.start)}` }}
          <span class="mdi mdi-calendar-arrow-left"></span>
          {{ `по ${clearData(place.end)}` }}
        </div> -->
        <!-- <div class="mt-8">Автор: {{ place.author.fullinfo.fullname }}</div> -->

        <div class="actions d-flex justify-center">
          <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="() => {}">
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
