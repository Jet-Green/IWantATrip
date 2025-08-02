<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from "../../stores/auth";

import { useGuide } from '../../stores/guide';
import MyGuideCard from './MyGuideCard.vue';


const router = useRouter()
const userStore = useAuth();

let guideStore = useGuide()

let showMoreButton = ref(true)
let guides = ref([])
let search = ref('')
let page = 1
let query = {
  user: userStore.user._id,
  name: { $regex: '', $options: 'i' },
};


let morePlaces = async () => {
  page++
  let res = await refreshGuides()

  if (res.length == postersLenght) {
    showMoreButton.value = false
  }
  postersLenght = res.length

}


async function refreshGuides() {
  if (page == 1) guides.value = []
  let res = await guideStore.getGuidesByUserId(page, query)
  guides.value.push(...res.data)
}

watch(search, (newSearch, oldSearch) => {

  if (newSearch.length > 2 || newSearch.length <= oldSearch.length) {
    query.name.$regex = newSearch
    refreshGuides()
  }
})

onMounted(async () => {
  await refreshGuides()
  if (guides.value < 20) {
    showMoreButton.value = false
  }
})

</script>

<template>
  <div>

    <div style="display: flex; justify-content:space-between; flex-wrap:wrap" class="pa-8">
      <div>
        <a-button class="btn_light ma-8" @click="router.push('/create-guide')">
          добавить гида
        </a-button>
      </div>

      <div>
        <a-input v-model:value="search" placeholder="поиск" style="width:180px" allow-clear />
      </div>

    </div>
    <a-row :gutter="[8, 8]">
      <a-col v-for="guide in guides" :span="24" :sm="12" :lg="8">

        <MyGuideCard @refreshGuides="refreshGuides()" :guide="guide">
        </MyGuideCard>
      </a-col>
      <a-col :span="24" class="justify-center d-flex" @click="morePlaces()" v-if="showMoreButton">
        <a-button>Ещё</a-button></a-col>
    </a-row>
  </div>
</template>

<style scoped></style>