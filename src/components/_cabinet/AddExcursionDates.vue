<script setup>
import { onMounted, ref } from "vue"

import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport'
dayjs.extend(objectSupport);
import ExcursionDates from '../ExcursionDates.vue'
import BuyExcursionDates from '../BuyExcursionDates.vue'
import { useRoute } from 'vue-router';
import { useRouter } from "vue-router";
import { useExcursion } from '../../stores/excursion';

const route = useRoute()
const router = useRouter()
const excursionStore = useExcursion()
const _id = route.query._id

let excursion = ref({})
let dates = ref([])
let clearDateForm = ref(false)

function setDates(d) {
  clearDateForm.value = false
  dates.value = d
}

let dontSubmit = false;
async function submit() {
  if (dontSubmit) return
  dontSubmit = true
  let res = await excursionStore.createDates(dates.value, _id)
  if (res.status == 200) {
    updateExcursion(_id)
    clearDateForm.value = true
    dontSubmit = false
    // router.push('/cabinet/excursions')
  }
}
function getDate(dateObj) {
  const dayjsDate = dayjs({ years: dateObj.year, months: dateObj.month, date: dateObj.day })
  if (!dayjsDate.$d) return ''
  let russianDate = (new Date(dayjsDate.$d)).toLocaleDateString('ru-RU', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).replaceAll(',', '').split(' ')

  return { weekday: russianDate[0], day: russianDate[1], month: russianDate[2] }
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

let deleteTime = async (dateId, timeId) => {
  await excursionStore.deleteTime(dateId, timeId)
  await updateExcursion(_id)
}
let deleteDate = async (dateId) => {
  await excursionStore.deleteDate(dateId)
  await updateExcursion(_id)
}

let updateExcursion = async (_id) => {
  const response = await excursionStore.getExcursionById(_id)
  excursion.value = response.data
}

onMounted(async () => {
  updateExcursion(_id)

})
</script>
<template>
  <a-row>

    <a-col :span="24">
      <a-breadcrumb style="cursor: pointer;">
        <a-breadcrumb-item @click="router.push('/cabinet/excursions')">
          К экскурсиям
        </a-breadcrumb-item>
        <a-breadcrumb-item>даты, время</a-breadcrumb-item>
      </a-breadcrumb>
      <h3 class="mt-8 mb-8">Добавить даты в "{{ excursion.name }}"</h3>
    </a-col>
    <a-col :span="24">
      <ExcursionDates @change-dates="setDates" :clearDateForm="clearDateForm" />

    </a-col>
    <a-col :span="24" class="d-flex justify-center mt-16 mb-16">
      <a-button @click="submit" type="primary" class="lets_go_btn">отправить</a-button>
    </a-col>
    <a-col :span="24" v-for="(date, index) in excursion.dates">
      <div class="date">
        <a-col class="d-flex" :xs="6" :md="3">
          <a-popconfirm title="Удалить дату?" ok-text="Да" cancel-text="Нет" @confirm="deleteDate(date._id)">
            <div class="large-date">
              {{ getDate(date.date).day }}
            </div>
          </a-popconfirm>
          <div class="column">
            <div class="month">{{ getDate(date.date).month }}</div>
            <div class="weekday">{{ getDate(date.date).weekday }}</div>
          </div>
        </a-col>
        <a-col class="d-flex" style="gap: 10px 20px; flex-wrap: wrap;">
          <a-col v-for="time in date.times" class="time-container">
            <a-popconfirm title="Удалить время?" ok-text="Да" cancel-text="Нет"
              @confirm="deleteTime(date._id, time._id)">
              <a-button shape="round" class="time">
                {{ getTime(time) }}
              </a-button>
            </a-popconfirm>
          </a-col>
        </a-col>
      </div>
      <a-divider />
    </a-col>


  </a-row>
</template>
<style scoped lang="scss">
.date {
  display: flex;

  .large-date {
    font-weight: 600;
    font-size: clamp(1.875rem, 1.3778rem + 1.4205vw, 2.5rem);
  }

  .time {
    font-weight: 600;
    font-size: clamp(0.75rem, 0.6009rem + 0.4261vw, 0.9375rem);
  }

  .time-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.column {
  flex-direction: column;

  .month {
    font-weight: 600;
    font-size: clamp(0.9375rem, 0.6889rem + 0.7102vw, 1.25rem);
  }

  .weekday {
    font-weight: 300;
    font-size: clamp(0.625rem, 0.4261rem + 0.5682vw, 0.875rem);
  }
}
</style>