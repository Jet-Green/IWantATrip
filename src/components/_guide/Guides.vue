<script setup>
import { ref, onMounted, reactive, nextTick } from 'vue'
import BackButtonAdaptive from "../BackButtonAdaptive.vue";
import GuideFilter from "./GuideFilter.vue";
import GuideCard from "./guides/GuideCard.vue";

import { useRouter, useRoute } from 'vue-router';
import { useGuide } from "../../stores/guide";

const router = useRouter()
const route = useRoute();
let guideStore = useGuide()
let query = reactive({
  isModerated: true,
  isRejected: false,
  isHidden: false,
})
const backRoute = { name: 'Landing', hash: '#guide' };
let guidesLength = 0
let showMoreButton = ref(true)
let page = 1
let isLoading = ref(false)

let moreGuides = async () => {
  page++
  let res = await guideStore.getGuides(page, query)

  if (res.length == guidesLength || res.length < 20) {
    showMoreButton.value = false
  }
  guidesLength = res.length

}
let refreshGuides = async () => {
  isLoading.value = true
  Object.assign(query, guideStore.filter)
  page = 1
  await guideStore.getGuides(page, query)
  isLoading.value = false
}
onMounted(async () => {
  await refreshGuides()
  if (route.hash) {
    let id = route.hash.slice(1)
    await nextTick()
    document.getElementById(id)?.scrollIntoView()

  }

})

</script>
<template>
  <div style="overflow-x: hidden; margin-bottom: 48px;" id="top">
    <a-row type="flex" justify="center">
      <a-col :xs="22" :md="20" :xl="18">
        <BackButtonAdaptive :backRoute="backRoute" />

        <h2 class="title">Гиды</h2>
        <GuideFilter @refreshGuides=refreshGuides />

        <a-spin v-if="isLoading" size="large" style="display: flex; justify-content: center; margin: 40px 0;" />

        <a-row v-else :gutter="[12, 16]">
          <a-col :span="24" :lg="6" v-for="guide in guideStore.guides" :key="guide._id">
            <GuideCard :id="guide._id" :guide="guide" withButton />
          </a-col>
        </a-row>

        <a-row v-if="!guideStore.guides.length && !isLoading">
          <a-col :span="24">
            <h3 style="text-align: center;">Гиды не найдены!</h3>
          </a-col>
        </a-row>

        <div class="d-flex justify-center ma-16" v-if="showMoreButton && !isLoading">
          <a-button type="primary" @click="moreGuides" style="border-radius: 100px;">Загрузить еще</a-button>
        </div>

      </a-col>
    </a-row>
  </div>


</template>

<style scoped>
.title {
  font-weight: 900;
}
</style>
