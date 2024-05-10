<script setup>
import datePlugin from '../plugins/dates'

const props = defineProps({
  dates: {
    type: Array
  },
  excursionId: {
    type: String
  }
})

const emit = defineEmits(['buy-excursion'])

const dates = props.dates
const excursionId = props.excursionId

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
function buyExcursion(time) {
  emit('buy-excursion', time)
}
</script>
<template>
  <a-row v-if="dates.length > 0">
    <a-col :span="24" v-for="(date, index) in dates">
      <div class="date">
        <div class="large-date">
          {{ getDate(date.date).day }}
        </div>
        <div class="column">
          <div class="month">{{ getDate(date.date).month }}</div>
          <div class="weekday">{{ getDate(date.date).weekday }}</div>
        </div>
        <div v-for="time in date.times" class="time-container">
          <a-button shape="round" class="time" @click="buyExcursion(time)">
            {{ getTime(time) }}
          </a-button>
        </div>
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
    min-width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.column {
  flex-direction: column;
  margin-left: 4px;

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