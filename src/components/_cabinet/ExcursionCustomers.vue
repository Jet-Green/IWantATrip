<script setup>
import ExcursionCustomerCard from './ExcursionCustomerCard.vue';

import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useExcursion } from '../../stores/excursion';

const router = useRouter()
const route = useRoute()
const excursionStore = useExcursion()

let excursion = ref({})
let time = ref({})

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
onMounted(async () => {
  let response = await excursionStore.getTimeCustomers(route.query.excursion_id, route.query.time_id)
  if (response.status == 200 && response.data.time?._id) {
    excursion.value = response.data.excursion
    time.value = response.data.time
  }
  loading.value = false
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
    <h3 class="mt-8 mb-8">Покупатели <span style="color: #ff6600;">{{ excursion.name }}</span></h3>
    <a-row :gutter="[16, 16]" v-if="time?.bills?.length > 0">
      <a-col :span="12" class="d-flex justify-center">
        <a-card hoverable class="button-card ">
          информация
        </a-card>
      </a-col>
      <a-col :span="12" class="d-flex justify-center">
        <a-card hoverable class="button-card d-flex justify-center align-center" style="border-color: #ff6600;  cursor: pointer;" >
          Записать на <br> экскурсию
        </a-card>
      </a-col>
      <a-col :span="24" :md="12" :xl="8" v-for="bill of time.bills">
        <ExcursionCustomerCard :bill="bill" />
      </a-col>
    </a-row>
    <a-row v-else>
      <a-col :span="24">
        пусто
      </a-col>
    </a-row>
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