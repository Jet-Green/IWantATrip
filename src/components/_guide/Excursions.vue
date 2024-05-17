<script setup>
import BackButton from "../BackButton.vue";
import ExcursionCard from "./ExcursionCard.vue";

import { onMounted, ref, toRefs, watch } from "vue"

import { useRouter } from 'vue-router';
import { useExcursion } from "../../stores/excursion";
import { useLocations } from "../../stores/locations";

const backRoute = { name: 'Landing', hash: '#guide' };
const router = useRouter()
const excursionStore = useExcursion()


let excursions = ref([])

async function updateExcursion() {
  let response = await excursionStore.getAll()
  excursions.value = response.data
}

watch(() => useLocations().location._id, async () => {
  await updateExcursion()
})

onMounted(async () => {
  await updateExcursion()
})
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h2>Экскурсии</h2>
        <a-row :gutter="[12, 16]">
          <a-col :span="24" :sm="12" :md="8" v-for="ex of excursions">
            <ExcursionCard :excursion="ex" @click="router.push(`/excursion?_id=${ex._id}`)" />
          </a-col>
        
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
