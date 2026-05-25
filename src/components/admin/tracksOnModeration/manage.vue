<script setup>
import { onMounted, ref } from "vue"
import { useTracks } from "../../../stores/track"
import { useRouter } from "vue-router"

const trackStore = useTracks()
let tracksManage = ref([])
let router = useRouter()

let page = 1
let query = { isModerated: true }

async function deleteTrack(_id) {
  await trackStore.deleteTrack(_id)
  await refreshTracksManage()
}

async function refreshTracksManage() {
  let data = await trackStore.getAll(page, query)
  tracksManage.value = data
}

onMounted(async () => {
  await refreshTracksManage()
})
</script>

<template>
  <a-row :gutter="[8, 8]" class="mt-8">
    <a-col
      :lg="8"
      :sm="12"
      :xs="24"
      v-if="tracksManage.length > 0"
      v-for="(track, index) of tracksManage"
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
          <MdiIcon name="ruler" />
          {{ track.length }} км
        </div>

        <div class="actions d-flex justify-center">
          <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="deleteTrack(track._id)">
            <MdiIcon style="color: #ff6600; cursor: pointer" name="delete" />
          </a-popconfirm>
          <MdiIcon @click="router.push(`/edit-track?_id=${track._id}&is_admin=${true}`)"
            style="color: #245159; cursor: pointer"
           name="pencil" />
          <MdiIcon @click="router.push(`/track?_id=${track._id}`)"
            style="color: #245159; cursor: pointer"
           name="eye-outline" />
        </div>
      </a-card>
    </a-col>
    <a-col :span="24" v-else> Нет опубликованных маршрутов </a-col>
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
