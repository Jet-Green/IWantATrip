<script setup>
import BackButton from "../BackButton.vue"
import { ref, onMounted } from "vue"
import { usePlaces } from "../../stores/place"
import { useRoute } from "vue-router"
import { useRouter } from "vue-router"

import PlaceCard from "../cards/PlaceCard.vue"

let route = useRoute()
let placeStore = usePlaces()
let place = ref({})
let isModerated = ref(false)
let isLoading = ref(false)
let moderationMessage = ref("")
let router = useRouter()


async function moderatePlace(_id) {
 await placeStore.moderatePlace(_id)
 router.push('/cabinet/moderation-places/on-moderation') 
}

async function rejectPlace(_id) {
  await placeStore.rejectPlace(_id)
  router.push('/cabinet/moderation-places/on-moderation') 
}

onMounted(async () => {
  let { data } = await placeStore.getById(route.query._id)
  console.log(data);

  place.value = data
  isModerated.value = place.value.isModerated
  moderationMessage.value = place.value.moderationMessage
})


</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton />
    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16" class="justify-center d-flex">
        <a-row>


          <a-col :xs="24">
            <PlaceCard :place="place" />
          </a-col>
          <a-col :xs="24">
            <a-textarea placeholder="Комментарии" v-model:value="moderationMessage"> </a-textarea>
            <div class="justify-center d-flex">
              <a-button :loading="isLoading" :disabled="isModerated" @click="moderatePlace(place._id)"
                class="lets_go_btn ma-36" type="primary">
                <span v-if="!isModerated">принять</span>
                <span v-else class="mdi mdi-check-outline"></span>
              </a-button>
              <a-button :disabled="isModerated" @click="rejectPlace(place._id)"
                class="btn_light ma-36">отказать</a-button>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<style lang="scss" scoped></style>
