<script setup>
import ExcursionCustomerCard from './ExcursionCustomerCard.vue';
import AddExcursionCustomerDialog from './AddExcursionCustomerDialog.vue';

import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useExcursion } from '../../stores/excursion';

const router = useRouter()
const route = useRoute()
const excursionStore = useExcursion()

let excursion = ref({})
let time = ref({})
let selectedDate = ref({})

function openAddDialog(time) {
  if (selectedDate.value._id) return
  for (let date of excursion.value.dates) {
    for(let t of date.times) {
      if (t._id == time._id) {
        selectedDate.value = {
          date: date.date,
          time
        }
        break
      }
    }
  }  
}
function closeAddDialog() {
  selectedDate.value = {}
}

function getTime(timeObj) {
  let result = timeObj.hours + ':'
  if (timeObj.minutes < 10) {
    result += '0' + timeObj.minutes
  } else {
    result += timeObj.minutes
  }
  return result
}
let loading = ref(true)

let updateExcursion = async () => {
  let response = await excursionStore.getTimeCustomers(route.query.excursion_id, route.query.time_id)
  if (response.status == 200 && response.data.time?._id) {
    excursion.value = response.data.excursion
    time.value = response.data.time
  }
  loading.value = false
}

onMounted(async () => {
  await updateExcursion()
})
</script>

<template>
  <div v-if="loading" class="d-flex justify-center">
    <img src="../../assets/images/founddog.webp" alt="" style="height: 150px; margin-top: 50px;">
  </div>
  <div v-else>
    <a-breadcrumb class="mb-16">
      <a-breadcrumb-item @click="router.push('/cabinet/excursions')" style="cursor: pointer;">
        К экскурсиям
      </a-breadcrumb-item>
      <a-breadcrumb-item style="cursor: pointer;"
        @click="router.push(`/cabinet/excursion-info?_id=${route.query.excursion_id}`)">{{ excursion.name
        }}</a-breadcrumb-item>
      <a-breadcrumb-item style="cursor: pointer;">{{ getTime(time) }}</a-breadcrumb-item>
    </a-breadcrumb>
    <h3 class="mt-8 mb-8"><span style="color: #ff6600;">{{ excursion.name }}</span> {{ getTime(time) }}</h3>
    <a-row :gutter="[16, 16]" class="mb-16">
      <a-col :span="12" class="d-flex justify-center">
        <a-card hoverable class="button-card ">
          <!-- {{ time }} -->
          статы
        </a-card>
      </a-col>
      <a-col :span="12" class="d-flex justify-center">
        <a-card hoverable class="button-card d-flex justify-center align-center"
          style="border-color: #ff6600;  cursor: pointer;" @click="openAddDialog(time)">
          Записать на <br> экскурсию
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]" v-if="time?.bills?.length > 0" class="mb-16">
      <a-col :span="24" :md="12" :xl="8" v-for="bill of time.bills">
        <ExcursionCustomerCard :bill="bill" @updateExcursion="updateExcursion" />
      </a-col>
    </a-row>
    <a-row v-else>
      <a-col :span="24">
        пусто
      </a-col>
    </a-row>
    <AddExcursionCustomerDialog :selectedDate="selectedDate" :excursion="excursion" @close="closeAddDialog" />
  </div>
</template>
<style lang="scss" scoped>
.button-card {
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  padding: 8px 12px;

  width: 100%;
  height: 100%;
}
</style>