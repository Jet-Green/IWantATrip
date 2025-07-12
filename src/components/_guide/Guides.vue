<script setup>
import BackButton from "../BackButton.vue";

import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useGuide } from "../../stores/guide";

const router = useRouter()
let guideStore = useGuide()
let guides = ref([])
let dbSkip = ref(0)
let limit = ref(true) // Initialize limit correctly
let query = ref({strQuery:""})

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
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <a-row :gutter="[16, 16]">
          <h2>Гиды</h2>
          <a-col v-for="g in guides" :key="g._id" :xs="24" class="mb-8" style="border: 5px solid #d9d9d9;">
            {{ g }}
          </a-col>
        </a-row>
        <a-button v-if="limit" type="primary" @click="loadMoreGuides">Загрузить еще</a-button>
      </a-col>
    </a-row>
  </div>
</template>
