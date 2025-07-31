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
let postersLength = 0
let page = 1

let moreGuides = async () => {
  page++
  let res = await guideStore.getGuides(page, query)

  if (res.length == postersLength) {
    showMoreButton.value = false
  }
  postersLength = res.length

}
let refreshGuides = async () => {
  Object.assign(query, guideStore.filter)
  page = 1
  postersLength = 0
  await guideStore.getGuides(page, query)
  if (guideStore.guides.length < 20) {
    showMoreButton.value = false
  } else {
    showMoreButton.value = true
  }
}
onMounted(async () => {
await refreshGuides()
  if (guideStore.guides.length < 20) {
    showMoreButton.value = false
  }
})
// useGuideStore.fetchElementsByQuery('watch');
</script>
<template>
 <div style="overflow-x: hidden; margin-bottom: 48px;" id="top">
    <BackButton :backRoute="backRoute" />
   <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
  
          <h2>Гиды</h2>
          <GuideFilter @refreshGuides=refreshGuides />
          <GuideCard v-for="guide in guideStore.guides"  :key="guide._id" :guide="guide" withButton/>
       
   
        <a-button v-if="showMoreButton" type="primary" @click="moreGuides">Загрузить еще</a-button>
      </a-col>
    </a-row>
  </div>



</template>
