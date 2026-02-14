<script setup>
import { onMounted, ref, h } from "vue"
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport'
dayjs.extend(objectSupport);
import ExcursionDates from '../ExcursionDates.vue'
import BuyExcursionDates from '../BuyExcursionDates.vue'
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useRoute } from 'vue-router';
import { useRouter } from "vue-router";
import { useExcursion } from '../../stores/excursion';
import { message } from "ant-design-vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import _ from "lodash";

const route = useRoute()
const router = useRouter()
const excursionStore = useExcursion()
const _id = route.query._id
let breakpoints = useBreakpoints(breakpointsTailwind)

let excursion = ref({})
let dates = ref([])
let addTime = ref()
let clearDateForm = ref(false)

function setDates(d) {
  clearDateForm.value = false
  dates.value = d
}

async function sendTime(date) {
  let res = await excursionStore.addTime(excursion.value._id, date, addTime.value)
  excursion.value.dates[excursion.value.dates.findIndex(ex_date => _.isEqual(date, ex_date.date))] = res
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
  let time_has_bills = await excursionStore.timeHasBills(timeId)
  console.log(time_has_bills)
  if (!time_has_bills) {
    await excursionStore.deleteTime(dateId, timeId)
    await updateExcursion(_id)
  }
  else {
    message.config({ duration: 1.5, top: "70vh" });
    message.error({
      content: "Имеются счета"
    })
  }
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

    <a-col :span="24" class="mb-16">
      <ExcursionDates @select="submit" @change-dates="setDates" :clearDateForm="clearDateForm" />
    </a-col>

    <!-- <a-col :span="24" class="d-flex justify-center mt-16 mb-16">
      <a-button @click="submit" type="primary" class="lets_go_btn">отправить</a-button>
    </a-col> -->

    <a-col :span="24" v-for="date in excursion.dates" class="date-container" style="padding: 10px 0;">
      <div class="date" :style="{ flexDirection: breakpoints.greaterOrEqual('md').value ? 'row' : 'column', gap: '16px' }">
        <div class="d-flex align-center" style="min-width: clamp(6.5625rem, 4.5536rem + 6.4286vw, 9.375rem);">
          <div class="large-date">
            {{ getDate(date.date).day }}
          </div>

          <div class="column ml-4">
            <div class="month">{{ getDate(date.date).month }}</div>
            <div class="weekday">{{ getDate(date.date).weekday }}</div>
          </div>
        </div>

        <div class="d-flex" style="gap: 10px 20px; flex-wrap: wrap;">
          <a-col v-for="time in date.times" class="time-container">
            <a-popconfirm title="Удалить время?" ok-text="Да" cancel-text="Нет"
              @confirm="deleteTime(date._id, time._id)">
              <a-button shape="round" class="time">
                {{ getTime(time) }}
              </a-button>
            </a-popconfirm>
          </a-col>
        </div>
      </div>

      <a-col class="d-flex pt-8">
        <VueDatePicker 
          v-model="addTime" 
          @update:model-value="sendTime(date.date)"
          placeholder="Время" 
          time-picker 
          :clearable="false"
          cancel-text="отмена"
          select-text="добавить" 
        >
          <template #dp-input>
            <a-button class="d-flex justify-center align-center text-center ml-8" shape="circle">
              <MdiIcon style="font-size: 18px" name="plus" />
            </a-button>
          </template>
        </VueDatePicker>

        <a-button @click="deleteDate(date._id)" class="d-flex justify-center align-center text-center ml-8" type="primary" shape="circle">
          <MdiIcon style="font-size: 18px" name="delete-outline" />
        </a-button>
      </a-col>
    </a-col>
  </a-row>
</template>
<style scoped lang="scss">
.date {
  display: flex;

  &-container {
    display: flex; 
    justify-content: space-between; 
    flex-direction: row;
  }

  .large-date {
    font-weight: 600;
    line-height: 1;
    font-size: clamp(1.875rem, 1.3778rem + 1.4205vw, 2.5rem);
    cursor: pointer;
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
  display: flex;
  flex-direction: column;
  gap: 6px;

  .month {
    font-weight: 600;
    line-height: 1;
    font-size: clamp(0.9375rem, 0.6889rem + 0.7102vw, 1.25rem);
  }

  .weekday {
    font-weight: 300;
    line-height: 1;
    font-size: clamp(0.625rem, 0.4261rem + 0.5682vw, 0.875rem);
  }
}
</style>