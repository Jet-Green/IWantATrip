<script setup>
import { onMounted, ref } from "vue"
import { useTracks } from "../../../stores/track"
import { useRouter } from "vue-router"

const trackStore = useTracks()
let tracksRejected = ref([])
let router = useRouter()

let page = 1
let query = { isRejected: true }

async function deleteTrack(_id) {
  await trackStore.deleteTrack(_id)
  await refreshTracksRejected()
}

async function refreshTracksRejected() {
  let data = await trackStore.getAll(page, query)
  tracksRejected.value = data
}

onMounted(async () => {
  await refreshTracksRejected()
})
</script>

<template>
  <a-row :gutter="[8, 8]" class="mt-8">
    <a-col
      :lg="8"
      :sm="12"
      :xs="24"
      v-if="tracksRejected.length > 0"
      v-for="(track, index) of tracksRejected"
      :key="index"
    >
      <a-card class="card" hoverable>
        <div style="text-align: center; font-weight: 600;">
          {{ track.title }}
        </div>
        <div style="text-align: center; font-size: 12px; color: #666;">
          {{ track.type }}
        </div>
        <a-divider class="ma-4" style="border-color: #205f79"></a-divider>
        <div v-if="track.length" style="font-size: 12px;">
          <span class="mdi mdi-ruler"></span>
          {{ track.length }} км
        </div>

        <div class="actions d-flex justify-center">
          <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="deleteTrack(track._id)">
            <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
          </a-popconfirm>
          <span
            class="mdi mdi-pencil"
            @click="router.push(`/edit-track?_id=${track._id}&is_admin=${true}`)"
            style="color: #245159; cursor: pointer"
          ></span>
        </div>
      </a-card>
    </a-col>
    <a-col :span="24" v-else> Нет отказанных маршрутов </a-col>
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
