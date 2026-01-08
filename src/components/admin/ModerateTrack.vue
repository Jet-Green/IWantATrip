<script setup>
import BackButton from "../BackButton.vue"
import { ref, onMounted } from "vue"
import { useTracks } from "../../stores/track"
import { useRoute } from "vue-router"
import { useRouter } from "vue-router"

let route = useRoute()
let trackStore = useTracks()
let track = ref({})
let isModerated = ref(false)
let isLoading = ref(false)
let moderationMessage = ref("")
let router = useRouter()

async function moderateTrack(_id) {
  await trackStore.moderateTrack(_id)
  router.push('/cabinet/moderation-tracks/on-moderation')
}

async function rejectTrack(_id) {
  await trackStore.rejectTrack(_id)
  router.push('/cabinet/moderation-tracks/on-moderation')
}

onMounted(async () => {
  let { data } = await trackStore.getById(route.query._id)
  track.value = data
  isModerated.value = track.value.isModerated
  moderationMessage.value = track.value.moderationMessage
})
</script>

<template>
  <div style="overflow-x: hidden">
    <BackButton />
    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16" class="justify-center d-flex">
        <a-row>
          <a-col :xs="24">
            <h2>{{ track.title }}</h2>
            <div style="margin-bottom: 16px;">
              <p><strong>Тип:</strong> {{ track.type }}</p>
              <p v-if="track.length"><strong>Длина:</strong> {{ track.length }} км</p>
              <p v-if="track.duration"><strong>Длительность:</strong> {{ track.duration }} мин</p>
              <p v-if="track.places?.length"><strong>Мест:</strong> {{ track.places.length }}</p>
              <div v-if="track.description" v-html="track.description"></div>
            </div>
          </a-col>
          <a-col :xs="24">
            <a-textarea placeholder="Комментарии" v-model:value="moderationMessage"></a-textarea>
            <div class="justify-center d-flex">
              <a-button :loading="isLoading" :disabled="isModerated" @click="moderateTrack(track._id)"
                class="lets_go_btn ma-36" type="primary">
                <span v-if="!isModerated">принять</span>
                <span v-else class="mdi mdi-check-outline"></span>
              </a-button>
              <a-button :disabled="isModerated" @click="rejectTrack(track._id)"
                class="btn_light ma-36">отказать</a-button>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
