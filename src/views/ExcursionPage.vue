<script setup>
import BackButton from '../components/BackButton.vue'

import { onMounted, ref } from 'vue'

import { useRoute } from "vue-router"
import {useExcursion} from '../stores/excursion.js'

const route = useRoute()
const _id = route.query._id

const excursionStore = useExcursion()

let edate = ref({})

onMounted(async () => {
  let response = await excursionStore.getEDateById(_id)
  edate.value = response.data
})
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton :backRoute="{ path: '/excursions' }" />
    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16" v-if="edate._id">
        <h2 class="ma-0">{{ edate.excursion.name }}</h2>
        
      </a-col>
    </a-row>
  </div>
</template>