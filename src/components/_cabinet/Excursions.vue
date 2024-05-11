<script setup>
import { ref, onMounted } from 'vue'
import ExcursionCard from './ExcursionCard.vue';

import ExcursionFilter from "../../components/sections/ExcursionFilter.vue";

import { useExcursion } from '../../stores/excursion'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

let excursions = ref([])
const router = useRouter()



const route = useRoute();

const excursionStore = useExcursion()
async function updateExcursion() {
  let response = await excursionStore.getUserExcursions()
  excursions.value = response.data
}

onMounted(async () => {
  await updateExcursion()
})
</script>
<template>
  <ExcursionFilter :search="route.query.search" />
  <a-row :gutter="[8,8]">
    <a-col  v-for="excursion in excursions" :span="24" :sm="12" :lg="8">
      <ExcursionCard :excursion="excursion" @updateExcursion="updateExcursion" />
    </a-col>
  </a-row>
</template>