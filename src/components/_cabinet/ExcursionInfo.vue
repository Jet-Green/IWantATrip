<script setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from 'vue-router';
import { useExcursion } from '../../stores/excursion';
import datePlugin from '../../plugins/dates'

const excursionStore = useExcursion()
const route = useRoute()
const router = useRouter()
const _id = route.query._id

let excursion = ref({})
let updateExcursion = async (_id) => {
  const response = await excursionStore.getExcursionBillsById(_id)
  excursion.value = response.data
}

function getDate(dateObj) {
  return datePlugin.excursions.getPrettyDate(dateObj)
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
function getBillsSum(bills) {
  let sum = 0
  for (let b of bills) {
    for (let p of b.cart) {
      sum += p.price * p.count
    }
  }
  return sum
}
function getPeopleCount(bills) {
  let sum = 0
  for (let b of bills) {
    for (let p of b.cart) {
      sum += p.count
    }
  }
  return sum
}
onMounted(async () => {
  updateExcursion(_id)
})
</script>

<template>
  <a-breadcrumb class="mb-16">
    <a-breadcrumb-item @click="router.push('/cabinet/excursions')" style="cursor: pointer;">
      К экскурсиям
    </a-breadcrumb-item>
    <a-breadcrumb-item style="cursor: pointer;">даты, время, покупатели</a-breadcrumb-item>
  </a-breadcrumb>

  <h3 class="mt-8 mb-8">Информация о <span style="color: #ff6600;">{{ excursion.name }}</span></h3>
  <a-row v-if="excursion?.dates?.length > 0">
    <a-col :span="24" v-for="(date, index) in excursion.dates">
      <div class="date">
        <a-col class="d-flex" :xs="6" :md="4">
          <div class="large-date">
            {{ getDate(date.date).day }}
          
          </div>
          <div class="column">
            <div class="month">{{ getDate(date.date).month }}</div>
            <div class="weekday">{{ getDate(date.date).weekday }}</div>
          </div>
        </a-col>
        <a-col :xs="18" :md="20" class="d-flex" style="gap: 10px 20px; flex-wrap: wrap;">
          <a-col v-for="time in date.times" class="time-container">
            <div class="time-card" @click="router.push(`/cabinet/excursion-customers?excursion_id=${excursion._id}&time_id=${time._id}&date=${getDate(date.date).day+'_'+getDate(date.date).month+'_'+getDate(date.date).weekday}`)">
              <div class="row">
                <span class="mdi mdi-clock-outline mr-4 icon"></span>
                <b>
                  {{ getTime(time) }}
                </b>
              </div>
              <div class="row">
                <span class="mdi mdi-account-multiple-outline mr-4 icon"></span>
                <b>{{ getPeopleCount(time.bills) }}</b>&nbsp;чел.
              </div>
              <div class="row">
                <span class="mdi mdi-cash-multiple mr-4 icon"></span>
                <b>{{ getBillsSum(time.bills) }}₽</b>
              </div>
            </div>
          </a-col>
        </a-col>
      </div>
      <a-divider />
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
.date {
  display: flex;
  align-items: center;

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

    .time-card {
      border: 1px solid #E0E0E0;
      border-radius: 12px;
      padding: 8px 12px;
      cursor: pointer;

      .icon {
        font-size: 18px;
      }

      .row {
        display: flex;
        align-items: center;
      }
    }
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