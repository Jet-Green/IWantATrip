<script setup>
import { onMounted, ref } from "vue"

import ExcursionDates from '../ExcursionDates.vue'

import { useRoute } from 'vue-router';
import { useRouter } from "vue-router";
import { useExcursion } from '../../stores/excursion';

const route = useRoute()
const router = useRouter()
const excursionStore = useExcursion()
const _id = route.query._id

let excursion = ref({})
let dates = ref([])

function setDates(d) {
  dates.value = d
}

let dontSubmit = false;
async function submit() {
  if (dontSubmit) return
  let res = await excursionStore.createDates(dates.value, _id)
  if (res.status == 200) {
    dontSubmit = true
    router.push('/cabinet/excursions')
  }
}

onMounted(async () => {
  const response = await excursionStore.getById(_id)
  excursion.value = response.data
})
</script>
<template>
  <a-row>
    <a-col :span="24">
      <h3>Добавить даты в <span style="color: #ff6600;">{{ excursion.name }}</span></h3>
    </a-col>
    <a-col :span="24">
      <ExcursionDates @change-dates="setDates" />

    </a-col>
    <a-col :span="24" class="d-flex justify-center mt-16 mb-16">
      <a-button @click="submit" type="primary" class="lets_go_btn">отправить</a-button>
    </a-col>
  </a-row>
</template>
<style scoped lang="scss"></style>