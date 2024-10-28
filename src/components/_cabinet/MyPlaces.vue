<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute();


let places = ref([])
let query = ref('')

let filteredPlaces = computed(() => {
  if (query.value.length > 2) {
    // localStorage.setItem("excursionQuery", query.value);
    // return excursions.value.filter((excursion) => excursion.name.toLowerCase().includes(query.value.toLowerCase())
    //   || excursion.description.toLowerCase().includes(query.value.toLowerCase())
    //   || excursion.excursionType.type.toLowerCase().includes(query.value.toLowerCase())
    //   || excursion.excursionType.directionType.toLowerCase().includes(query.value.toLowerCase())
    //   || excursion.excursionType.directionPlace.toLowerCase().includes(query.value.toLowerCase())
    // )
  } else {
    // localStorage.setItem("excursionQuery", '');
    return places.value
  }

})
</script>
<template>
  <div>

<div style="display: flex; justify-content:space-between; flex-wrap:wrap" class="pa-8">
  <div>
    <a-button class="btn_light ma-8" @click="router.push('/create-place')">
      создать место
    </a-button>
  </div>
  <div>
    <a-input v-model:value="query" placeholder="поиск" style="width:180px" />
  </div>
  
</div>
<a-row :gutter="[8, 8]">
  <a-col v-for="place in filteredPlaces" :span="24" :sm="12" :lg="8">
    
    <!-- <ExcursionCard :excursion="excursion" @updateExcursion="updateExcursion" /> -->
  </a-col>
 
</a-row>
</div>
</template>