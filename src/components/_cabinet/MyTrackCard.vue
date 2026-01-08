<script setup>
import { toRefs, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTracks } from "../../stores/track"

let props = defineProps(['track'])
let emit = defineEmits(['refreshTracks'])

const router = useRouter()
const trackStore = useTracks()
let color = ref('black')
let show = ref(false)

let { track } = toRefs(props)

let status = computed(() => {
  if (track.value?.isHidden) {
    color.value = 'black'
    return "скрыто"
  }
  if (track.value?.isRejected) {
    color.value = '#ff6600'
    return "отказано"
  }
  if (!track.value?.isModerated) {
    color.value = '#20A0CF'
    return "на проверке"
  } else {
    color.value = 'black'
    return "на сайте"
  }
})

async function trackToDelete(_id) {
  try {
    const response = await trackStore.deleteTrack(_id)
    if (response?.status == 200) {
      emit('refreshTracks')
    }
  } catch (error) {
    console.error('Ошибка при удалении маршрута:', error)
  }
}

async function hideTrack(_id) {
  try {
    const response = await trackStore.edit({
      _id: _id,
      isHidden: !track.value.isHidden
    })
    if (response?.status == 200) {
      track.value.isHidden = !track.value.isHidden
      emit('refreshTracks')
    }
  } catch (error) {
    console.error('Ошибка при скрытии маршрута:', error)
  }
}
</script>

<template>
  <a-card class="card" :class="[track.isHidden ? 'overlay' : '']" v-if="track._id">
    <div style="width: 100%; height: 100%; text-align: center; font-weight: 700;">
      {{ track.title }}
    </div>
    <div v-if="track?.type" style="text-align: center;">
      {{ track?.type }}
    </div>
    <div v-if="track?.length" style="text-align: center; font-size: 12px; color: #666;">
      {{ track.length }} км
    </div>

    <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
    <div class="actions">
      <div>
        <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="trackToDelete(track._id)">
          <span class="mdi mdi-delete" style="color: #ff6600;"></span>
        </a-popconfirm>

        <a-popconfirm title="Скрыть/показать?" ok-text="Да" cancel-text="Нет" @confirm="hideTrack(track._id)">
          <span v-if="!track.isHidden" class="mdi mdi-eye-outline"></span>
          <span v-else class="mdi mdi-eye-off-outline"></span>
        </a-popconfirm>

        <a-popconfirm title="Редактировать?" ok-text="Да" cancel-text="Нет"
          @confirm="router.push(`/edit-track?_id=${track._id}`)">
          <span class="mdi mdi-pen"></span>
        </a-popconfirm>

        <span class="mdi mdi-information-outline" @click="show=!show"></span>
      </div>
      <div :style="{ color }" style="font-size:14px">
        {{ status }}
      </div>
    </div>

    <a-modal v-model:open="show" :footer="null" :title="track.title">
      <div>
        <p><strong>Тип:</strong> {{ track.type }}</p>
        <p><strong>Длина:</strong> {{ track.length }} км</p>
        <p v-if="track.duration"><strong>Длительность:</strong> {{ track.duration }} мин</p>
        <div v-if="track.description" v-html="track.description"></div>
      </div>
    </a-modal>
  </a-card>
</template>

<style scoped lang="scss">
.actions {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  cursor: pointer;
  position: relative;
  color: #245159;

  * {
    margin: 4px;
    cursor: pointer;
  }
}

.overlay {
  opacity: 0.5;
}

.card {
  min-height: 100px;
}
</style>
