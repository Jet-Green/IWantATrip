<script setup>
import datePlugin from '../plugins/dates'
import { ref, onMounted, watch } from "vue";
import { useExcursion } from '../stores/excursion';
import { useAuth } from "../stores/auth";
import router from '../router';

const props = defineProps({
  excursionId: {
    type: String
  },
  maxPeople: {
    type: Number
  },
  buy: {
    type: Boolean
  }
})

const emit = defineEmits(['buy-excursion'])

let excursion = ref({})
const excursionId = props.excursionId
const excursionStore = useExcursion()
const userSrore = useAuth()
async function updateDates() {
  let response = await excursionStore.getExcursionBillsById(excursionId)
  excursion.value = response.data;

}
await updateDates()


watch(props, () => updateDates())

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

function getPeopleCount(bills) {
  let sum = 0
  for (let b of bills) {
    for (let p of b.cart) {
      sum += p.count
    }
  }
  return sum
}
function getBookingCount(timeId) {
  return excursion.value.bookings.reduce((total, item) => {
    if (item.time == timeId) {
      total = total + (item.count);
    }
    return total
  }, 0);
}

async function buyExcursion(time, bookingsCount) {
  if (!userSrore.isAuth) {
    router.push('/auth')
  } else {
    emit('buy-excursion', { time, bookingsCount })
  }

}
</script>
<template>
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
            <a-button :class="{ 'primary_color': getPeopleCount(time.bills) >= props.maxPeople }"
              :disabled="getPeopleCount(time.bills) >= props.maxPeople" class="time" shape="round"
              @click="buyExcursion(time, getBookingCount(time._id))">

              {{ getTime(time) }}
            </a-button>

            <span v-if="getPeopleCount(time.bills)"
              :class="{ 'primary_color': getPeopleCount(time.bills) >= props.maxPeople }">
              {{ getPeopleCount(time.bills) + ' из ' + props.maxPeople }}
            </span>
            <span v-if="getBookingCount(time._id)"
              :class="{ 'primary_color': getBookingCount(time._id) >= props.maxPeople }">
              {{ getBookingCount(time._id) + ' из ' + props.maxPeople }}
            </span>
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
    flex-direction: column;
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

.primary_color {
  color: #ff6600;
}
</style>
