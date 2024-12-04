<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useAuth } from "../../../stores/auth";
import { usePartners } from "../../../stores/partner";
import PartnerCard from './PartnerCard.vue';





const router = useRouter()
const route = useRoute();
const userStore = useAuth();
const partnerStore = usePartners()

let showMoreButton = ref(true)
let partners = ref([])

let search = ref('')
let page = 1
let query = {
  author: userStore.user._id,
  $or: [
    { name: { $regex: '', $options: 'i' } },
    { category: { $regex: '', $options: 'i' } }
  ]
};


let morePartners = async () => {
  page++
  let res = await refreshPartners()

  if (res.length == partnersLenght) {
    showMoreButton.value = false
  }
  partnersLenght = res.length

}


async function refreshPartners() {
  page = 1
  let data = await partnerStore.getAll(page, query)
  partners.value = data
}

watch(search, (newSearch, oldSearch) => {

  if (newSearch.length > 2 || newSearch.length <= oldSearch.length) {
    query.$or[0].name.$regex = newSearch
    query.$or[1].category.$regex = newSearch
    refreshPartners()
  }
})

onMounted(async () => {
  await refreshPartners()
  if (partnerStore.partners.length < 20) {
    showMoreButton.value = false
  }
})
</script>
<template>
  <div>

    <div style="display: flex; justify-content:space-between; flex-wrap:wrap" class="pa-8">
      <div>
        <a-button class="btn_light ma-8" @click="router.push('/create-partner')">
          создать партнера
        </a-button>
      </div>

      <div>
        <a-input v-model:value="search" placeholder="поиск" style="width:180px" allow-clear />
      </div>

    </div>
    <a-row :gutter="[8, 8]">
      <a-col v-for="partner in partners" :span="24" :sm="12" :lg="8">

        <PartnerCard @refreshPartners="refreshPartners()" :partner="partner">
        </PartnerCard>

      </a-col>
      <a-col :span="24"  class="justify-center d-flex" @click="morePartners()" v-if="showMoreButton"> <a-button>Ещё</a-button></a-col>
    </a-row>
  </div>
</template>