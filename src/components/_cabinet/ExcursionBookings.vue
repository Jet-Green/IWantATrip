<script setup>
import ExcursionBookingCard from './ExcursionBookingCard.vue'

import { onMounted, ref, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useExcursion } from '../../stores/excursion';
import PrintExcursionCustomers from '../../components/_cabinet/PrintExcursionCustomers.vue'

const router = useRouter()
const route = useRoute()
const excursionStore = useExcursion()

const app = getCurrentInstance();
const htmlToPaper = app.appContext.config.globalProperties.$htmlToPaper;

let excursion = ref({})
let bookings = ref([])
let loading = ref(true)



const print = async () => {
  await htmlToPaper('printMe');
};

onMounted(async () => {
  let response = await excursionStore.getTimeBookings(route.query.excursion_id, route.query.time_id)
  if (response.status == 200) {
    excursion.value = response.data.excursion
    bookings.value = response.data.bookings
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
        @click="router.push(`/cabinet/excursion-booking-info?_id=${route.query.excursion_id}`)">{{ excursion.name
        }}</a-breadcrumb-item>
      <a-breadcrumb-item style="cursor: pointer;">{{ route.query.time }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-row class="mb-8">
      <a-col class="d-flex align-center" :span="12">
        <h3>Заказы <span style="color: #ff6600;">{{ excursion.name }}</span></h3>
      </a-col>
      <a-col :span="12" class="d-flex justify-end">
        <a-button @click="print()" type="primary" class="lets_go_btn">
          <span class="mdi mdi-printer-outline mr-4"></span> Печать
        </a-button>
      </a-col>
    </a-row>
    <div id="printMe"  v-if="bookings.length > 0" style="display: none">
      <PrintExcursionCustomers :bookings="bookings" :excursion="excursion" />
    </div>
    <a-row :gutter="[16, 16]" v-if="bookings.length > 0">
      <a-col :span="24" :md="12" :lg="8" v-for="booking of bookings">
        <ExcursionBookingCard :booking="booking" />
      </a-col>
    </a-row>
    <a-row v-else>
      <a-col :span="24">
        пусто
      </a-col>
    </a-row>
  </div>
</template>