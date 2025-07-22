<script setup>
import { ref, onMounted, reactive } from 'vue'
import BackButton from "../BackButton.vue";
import PlaceFilter from "./PlaceFilter.vue";
import GuideCard from "./guides/GuideCard.vue";

import { useRouter } from 'vue-router';
import { useGuide } from "../../stores/guide";

const router = useRouter()
let guideStore = useGuide()
let guides = ref([])
let dbSkip = ref(0)
let limit = ref(true) // Initialize limit correctly
let query = ref({strQuery:""})
const backRoute = { name: 'Landing', hash: '#guide' };

async function refreshGuides() {
    dbSkip.value = 0;
    guides.value = [];
    limit.value = true; 
    await loadMoreGuides();
}
async function loadMoreGuides() {
    if (!limit.value) return;
    try {
        let res = await guideStore.getGuides(query.value, dbSkip.value)
        if (res.data && res.data.data) {
            dbSkip.value = res.data.dbSkip
            guides.value.push(...res.data.data)
            if (res.data.ended) {
                limit.value = false 
            }
        } else {
            limit.value = false; 
        }
    } catch (error) {
        console.error("Error fetching guides:", error);
        message.error("Не удалось загрузить гидов.");
        limit.value = false; 
    }
}
onMounted(async () => {
    await loadMoreGuides();
})
// useGuideStore.fetchElementsByQuery('watch');
</script>
<template>
 <div style="overflow-x: hidden" id="top">
    <BackButton :backRoute="backRoute" />
   <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
  
          <h2>Гиды</h2>
          <!-- <PlaceFilter/> -->
          <GuideCard v-for="guide in guides"  :key="guide._id" :guide="guide" withButton/>
       
   
        <a-button v-if="limit" type="primary" @click="loadMoreGuides">Загрузить еще</a-button>
      </a-col>
    </a-row>
  </div>



</template>
