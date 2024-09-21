<script setup>
import { ref, onMounted, computed } from 'vue'
import ExcursionCard from './ExcursionCard.vue';

import { useExcursion } from '../../stores/excursion'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute();

const excursionStore = useExcursion()


let excursions = ref([])
let query = ref('')
let filteredExcursion = computed(() => {
  if (query.value.length > 2) {
    localStorage.setItem("excursionQuery", query.value);
    return excursions.value.filter((excursion) => excursion.name.toLowerCase().includes(query.value.toLowerCase())
      || excursion.description.toLowerCase().includes(query.value.toLowerCase())
      || excursion.excursionType.type.toLowerCase().includes(query.value.toLowerCase())
      || excursion.excursionType.directionType.toLowerCase().includes(query.value.toLowerCase())
      || excursion.excursionType.directionPlace.toLowerCase().includes(query.value.toLowerCase())

    )
  } else {
    localStorage.setItem("excursionQuery", '');
    return excursions.value
  }

})



async function updateExcursion() {
  let response = await excursionStore.getUserExcursions()
  excursions.value = response.data
}

onMounted(async () => {
  query.value = localStorage.getItem("excursionQuery") ?? '';
  await updateExcursion()
})
</script>
<template>
  <div>

    <div style="display: flex; justify-content:space-between; flex-wrap:wrap" class="pa-8">
      <div>
        <a-button class="btn_light ma-8" @click="router.push('/create-excursion')">
          создать экскурсию
        </a-button>
      </div>
      <div>
        <a-input v-model:value="query" placeholder="поиск" style="width:180px" />
      </div>
      
    </div>
    <a-row :gutter="[8, 8]">
      <a-col v-for="excursion in filteredExcursion" :span="24" :sm="12" :lg="8">
        <ExcursionCard :excursion="excursion" @updateExcursion="updateExcursion" />
      </a-col>
     
    </a-row>
  </div>
</template>