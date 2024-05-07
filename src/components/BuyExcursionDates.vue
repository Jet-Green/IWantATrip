<script setup>
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport'
dayjs.extend(objectSupport);

const props = defineProps({
  dates: {
    type: Array
  },
  excursionId: {
    type: String
  }
})

const dates = props.dates
const excursionId = props.excursionId

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
</script>
<template>
  <a-row v-if="dates.length > 0">
    <a-col :span="24" v-for="date in dates">
      <div class="date">
        <div class="large-date">
          {{ getDate(date.date).day }}
        </div>
        <div class="column">
          <div class="month">{{ getDate(date.date).month }}</div>
          <div class="weekday">{{ getDate(date.date).weekday }}</div>
        </div>
        <div v-for="time in date.times">
          <a-checkable-tag>
            {{ getTime(time) }}
          </a-checkable-tag>
        </div>
      </div>
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