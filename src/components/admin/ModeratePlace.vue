<script setup>
import BackButton from "../BackButton.vue"
import { ref, onMounted } from "vue"
import { usePlaces } from "../../stores/place"
import { useRoute } from "vue-router"
import { useRouter } from "vue-router"

import datePlugin from "../../plugins/dates"

let route = useRoute()
let placeStore = usePlaces()
let place = ref({})
let isModerated = ref(false)
let isLoading = ref(false)
let moderationMessage = ref("")
let router = useRouter()
let activeKey = ref(null)

async function moderatePlace(_id) {
  // if (!isModerated.value) {
  //   isLoading.value = true
  //   let res = await placeStore.moderatePlace(_id)
  //   if (res.status != 400) {
  //     setTimeout(() => {
  //       isModerated.value = true
  //       isLoading.value = false
  //       router.push("/cabinet/moderation-trips/not-moderated-trips")
  //     }, 500)
  //   } else {
  //     isModerated.value = false
  //   }
  // }
}

async function sendModerationMessage() {
  // let res = await placeStore.sendModerationMessage(place.value._id, moderationMessage.value)
  // if (res.status == 200) {
  //   router.push("/cabinet/moderation-places/on-moderation")
  // }
}

onMounted(async () => {
  let { data } = await placeStore.getById(route.query._id)
  console.log(data);
  
  place.value = data
  isModerated.value = place.value.isModerated
  moderationMessage.value = place.value.moderationMessage
})

// service methods
const clearData = (dataString) => {
  let date
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
function getImg(index) {
  return place.value.images[index]
}
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton />

    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
        <h2 class="ma-0">{{ place.name }}</h2>
        <p>
          Автор: {{ place.author?.fullinfo?.fullname }} <br />
          Телефон:
          <a :href="'tel:' + place.author?.fullinfo?.phone">{{ place.author?.fullinfo?.phone }}</a>
        </p>
        <p>
          <i> {{ place.offer }}</i>
        </p>
        <a-spin v-if="!place._id" size="large"></a-spin>
        <a-row v-if="place._id" :gutter="[12, 12]" class="text justify-center d-flex">
          <a-col :xs="24" :md="12">
            <a-carousel arrows dots-class="slick-dots slick-thumb">
              <template #customPaging="props">
                <a>
                  <img :src="getImg(props.i)" />
                </a>
              </template>
              <div v-for="(item, i) in place.images" :key="i">
                <img :src="item" alt="" srcset="" />
              </div>
              <template #prevArrow>
                <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                  <span class="mdi mdi-48px mdi-chevron-left"></span>
                </div>
              </template>
              <template #nextArrow>
                <div class="custom-slick-arrow" style="right: 10px">
                  <span class="mdi mdi-48px mdi-chevron-right"></span>
                </div>
              </template>
            </a-carousel>
          </a-col>
          <a-col :xs="24" :md="12" class="pa-8"> Какая-то инфа по месту </a-col>

          <a-col :xs="24">
            <span v-html="place.description"></span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16" class="justify-center d-flex">
        <a-button
          :loading="isLoading"
          :disabled="isModerated"
          @click="moderatePlace(place._id)"
          class="lets_go_btn ma-36"
          type="primary"
        >
          <span v-if="!isModerated">принять</span>
          <span v-else class="mdi mdi-check-outline"></span>
        </a-button>
      </a-col>
    </a-row>
    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
        <a-textarea placeholder="Комментарии" v-model:value="moderationMessage"> </a-textarea>
        <div class="justify-center d-flex">
          <a-button :disabled="isModerated" @click="sendModerationMessage" class="btn_light ma-36"
            >отправить на доработку</a-button
          >
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<style lang="scss" scoped>
img {
  width: 100%;
  aspect-ratio: 270/175;
  object-fit: cover;
}

.ant-carousel :deep(.slick-dots) {
  position: relative;
  height: auto;
}

.ant-carousel :deep(.slick-slide img) {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 100%;
}

.ant-carousel :deep(.slick-thumb) {
  bottom: 0px;
}

.ant-carousel :deep(.slick-thumb li) {
  width: 60px;
  height: 45px;
}

.ant-carousel :deep(.slick-thumb li img) {
  width: 100%;
  // height: 100%;
  filter: grayscale(100%);
  display: block;
}

.ant-carousel :deep(.slick-thumb li.slick-active img) {
  filter: grayscale(0%);
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  color: white;
  line-height: normal;
  width: 50px;
  height: 50px;
  opacity: 1;
  z-index: 1;
  top: 40%;
}
</style>
