<script setup>
import ExcursionBookingCard from './ExcursionBookingCard.vue'
import AddExcursionCustomerDialog from './AddExcursionCustomerDialog.vue';

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

let time = ref({})
let selectedDate = ref({})

function openAddDialog(time) {
  if (selectedDate.value._id) return
  for (let date of excursion.value.dates) {
    for (let t of date.times) {
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
  updateExcursion()
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
function getPeopleCount(timeId) {
  let sum = 0
  for (let book of excursion.value.bookings) {
    if (book.time == timeId) {
      sum += book.count;
    }
  }
  return sum
}
async function updateExcursion() {
  let response = await excursionStore.getTimeBookings(route.query.excursion_id, route.query.time_id)
  if (response.status == 200) {
    excursion.value = response.data.excursion
    bookings.value = response.data.bookings
    time.value = response.data.time
  }
  loading.value = false
}
onMounted(async () => {
  await  updateExcursion()
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
      <a-breadcrumb-item style="cursor: pointer;">{{ getTime(time) }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-row :gutter="[16, 16]" class="mb-16">
      <a-col :span="12" class="d-flex justify-center">
        <a-card hoverable class="button-card ">
          <div class="row">
            <span class="mdi mdi-clock-outline mr-4 icon"></span>
            <b>
              {{ getTime(time) }}
            </b>&nbsp;
            <b>
              {{ route.query.date.split('_').join(' ') }}
            </b>
          </div>
          <div class="row space-between">
            <div>
              <span class="mdi mdi-account-multiple-outline mr-4 icon"></span>
              <b>{{ getPeopleCount(time._id) }}</b>&nbsp;чел.
            </div>

            <div>


              <a-button @click="print()" class="d-flex justify-center align-center" type="primary" shape="circle">
                <span style="font-size:18px" class="mdi mdi-printer-outline"></span>
              </a-button>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="12" class="d-flex justify-center">
        <a-card hoverable class="button-card d-flex justify-center align-center"
          style="border-color: #ff6600;  cursor: pointer;" @click="openAddDialog(time)">
          Записать на <br> экскурсию
        </a-card>
      </a-col>
    </a-row>
    <h3 class="mt-8 mb-8"><span style="color: #ff6600;">{{ excursion.name }}</span></h3>
    <a-row :gutter="[16, 16]" v-if="bookings.length > 0" class="mb-16">
      {{ excursion.bookings }}
      <a-col :span="24" :md="12" :lg="8" v-for="booking of bookings">
        <ExcursionBookingCard :booking="booking" />
      </a-col>
    </a-row>
    <a-row v-else>
      <a-col :span="24">
        пусто
      </a-col>
    </a-row>
    <AddExcursionCustomerDialog :selectedDate="selectedDate" :excursion="excursion" @close="closeAddDialog" />
    <div id="printMe" style="display: none">
      <PrintExcursionCustomers :date='route.query.date' :excursion="excursion" :time="getTime(time)"
        :bookings="bookings" />
    </div>
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

.icon {
  font-size: 18px;
}

.row {
  display: flex;
  align-items: center;
}
</style>