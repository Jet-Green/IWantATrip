<script setup>
import { onMounted, ref } from "vue"

import BackButton from '../BackButton.vue'

import ExcursionDates from '../ExcursionDates.vue'

import { useRoute } from 'vue-router';
import { useExcursion } from '../../stores/excursion';

const route = useRoute()
const excursionStore = useExcursion()
const _id = route.query._id

let excursion = ref({})
let dates = ref([])

function setDates(d) {
  dates.value = d
}

async function submit() {
  await excursionStore.createDates(dates.value, _id)
}

onMounted(async () => {
  const response = await excursionStore.getById(_id)
  excursion.value = response.data
})
</script>
<template>
  <a-row>
    <a-col :span="24">
      {{ excursion }}
      <ExcursionDates @change-dates="setDates" />

      <a-button @click="submit">отправить</a-button>
    </a-col>
  </a-row>
</template>