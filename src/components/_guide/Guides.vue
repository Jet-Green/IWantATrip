<script setup>
import { ref, onMounted, reactive } from 'vue'
import BackButton from "../BackButton.vue";
import GuideFilter from "./GuideFilter.vue";
import GuideCard from "./guides/GuideCard.vue";

import { useRouter } from 'vue-router';
import { useGuide } from "../../stores/guide";

const router = useRouter()
let guideStore = useGuide()
let query = reactive({
  isModerated: true,
  isRejected: false,
  isHidden: false,
})
const backRoute = { name: 'Landing', hash: '#guide' };
let showMoreButton = ref(true)
let guidesLength = 0
let page = 1

let moreGuides = async () => {
  page++
  let res = await guideStore.getGuides(page, query)

  if (res.length == guidesLength || res.length < 20) {
    showMoreButton.value = false
  }
  guidesLength = res.length

}
let refreshGuides = async () => {
  Object.assign(query, guideStore.filter)
  page = 1
  await guideStore.getGuides(page, query)
}
onMounted(async () => {

  await refreshGuides()



})

</script>
<template>
  <div style="overflow-x: hidden; margin-bottom: 48px;" id="top">
    <BackButton :backRoute="backRoute" />
    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">

        <h2>Гиды</h2>
        <GuideFilter @refreshGuides=refreshGuides />
        <GuideCard v-for="guide in guideStore.guides" :key="guide._id" :guide="guide" withButton />

        <div class="d-flex justify-center">
          <a-button v-if="showMoreButton" type="primary" @click="moreGuides">Загрузить еще</a-button>
        </div>

      </a-col>
    </a-row>
  </div>



</template>
