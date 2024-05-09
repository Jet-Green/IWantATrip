<script setup>
import { ref, toRefs, watch, onMounted } from "vue"
import _ from "lodash"
import datePlugin from '../plugins/dates'

let props = defineProps({
  selectedDate: Object,
  excursion: Object,
})
const emit = defineEmits(['close'])

let open = ref(false)

let { selectedDate } = toRefs(props)

let prettyDate = ref()
let prettyTime = ref()
watch(selectedDate, (newValue) => {
  if (!_.isEmpty(newValue)) {
    open.value = true
    prettyDate.value = datePlugin.excursions.getPrettyDate(newValue.date)
    let tmpTime = newValue.time.hours + ':'
    if (newValue.time.minutes < 10) {
      tmpTime += '0' + newValue.time.minutes
    } else {
      tmpTime += newValue.time.minutes
    }
    prettyTime.value = tmpTime
  }
})


</script>
<template>
  <a-modal v-model:open="open" @cancel="emit('close')" :footer="null">
    <div class="date">
      <div class="d-flex">
        <div class="large-date">
          {{ prettyDate.day }}
        </div>
        <div class="column">
          <div class="month">{{ prettyDate.month }}</div>
          <div class="weekday">{{ prettyDate.weekday }}</div>
        </div>
      </div>
      <div class="name">
        {{ excursion.name }}
      </div>
    </div>
    <div class="large-date">
      {{ prettyTime }}
    </div>
    <div v-for="price of excursion.prices">
      <div class="price-container">
        <div class="price">{{ price.type }} x <span style="color: #ff6600;">{{ price.price }}₽</span></div>
        <div>
          <a-input-number :min="0" :max="excursion.maxPeople" style="border-radius: 12px;" :controls="false">
          </a-input-number>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<style scoped lang="scss">
.large-date {
  font-weight: 600;
  font-size: clamp(1.875rem, 1.3778rem + 1.4205vw, 2.5rem);
}

.date {
  display: flex;
  justify-content: space-between;

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

.name {
  font-weight: 600;
  font-size: clamp(0.9375rem, 0.6889rem + 0.7102vw, 1.25rem);
  width: 100%;
  text-align: center;
  margin-top: 20px;
  color: #ff6600;
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

.price-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .price {
    font-weight: 600;
    font-size: clamp(0.875rem, 0.6761rem + 0.5682vw, 1.125rem);
  }
}
</style>