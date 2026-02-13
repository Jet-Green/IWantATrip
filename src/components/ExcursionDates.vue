<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import datePlugin from '../plugins/dates'
import { ref, watch, toRefs } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'

const emit = defineEmits(['change-dates', 'select'])
const props = defineProps(['clearDateForm'])

let { clearDateForm } = toRefs(props)
let activeKey = ref(0)

let dates = ref([])
// нужно валидировать так, чтобы не было null в times
let times = ref([])

watch(dates, (newValue, oldValue) => {
  if (newValue.length > oldValue.length) {
    while (times.value.length != newValue.length) {
      times.value.push([])
    }
  } else if (newValue.length < oldValue.length) {
    while (times.value.length != newValue.length) {
      times.value.pop()
    }
  }
})

watch(clearDateForm, () => {
  if (clearDateForm) {
    dates.value = []
    times.value = []
  }

})

let selected = ref(false)

watch([dates, times], () => {
 
  let timesWithoutNull = times.value.map((time) => {
    return time.filter((item) => { 
     return  item != null
    })
  })
  emit('change-dates', datePlugin.excursions.concatDateAndTime(dates.value, timesWithoutNull))
  if (selected.value && datePlugin.excursions.concatDateAndTime(dates.value, timesWithoutNull).length) {
    emit('select')
    selected.value = false
  }
}, { deep: true })
</script>
<template>
  <a-row>
   
    <a-col>
      <!-- <VueDatePicker v-model="dates" multi-dates locale="ru-Ru" calendar-class-name="dp-custom-calendar" placeholder="выберите дату"
        calendar-cell-class-name="dp-custom-cell" cancel-text="отмена" select-text="выбрать" :min-date="new Date()"
        :enable-time-picker="false" format="dd/MM/yyyy">
        <template #input-icon>
          <MdiIcon style="font-size: 20px; color: rgba(95, 95, 95, 0.65);" name="calendar-outline" class="ml-8" />
        </template>
      </VueDatePicker> -->
      <VueDatePicker 
        v-model="dates"
        @update:model-value="selected = true" 
        multi-dates 
        locale="ru-Ru" 
        calendar-class-name="dp-custom-calendar" 
        placeholder="выберите дату"
        calendar-cell-class-name="dp-custom-cell" 
        cancel-text="отмена" 
        select-text="выбрать" 
        :min-date="new Date()"
        :enable-time-picker="false" 
        format="dd/MM/yyyy"
      >
        <template #dp-input>
            <a-button class="d-flex lets_go_btn justify-center align-center text-center ml-8" type="primary">
              <MdiIcon style="font-size: 18px; padding-right: 4px;" name="plus" /> добавить
            </a-button>
          </template>
      </VueDatePicker>
    </a-col>
    <!-- <a-col :span="24">
      <a-row v-for="(date, i) of dates">
        <a-col :span="24">
          <a-collapse v-model:activeKey="activeKey" ghost>
            <a-collapse-panel :key="i">
              <template #header>
                {{ (new Date(date)).toLocaleDateString('ru-RU', {
      year: 'numeric', month: 'long', day: 'numeric'
    }) }} {{ times[i].length == 0 ? 'по запросу' : '' }}
              </template>
              <a-row :gutter="[6, 6]" class="mb-16 d-flex justify-center">
                <a-col v-for="(time, j) of times[i]" :span="24" :md="12" :lg="8" v-if="times[i].length > 0">
                  <VueDatePicker v-model="times[i][j]" placeholder="Время" time-picker cancel-text="отмена"
                    select-text="выбрать" @cleared="times[i].splice(j, 1)">
                    <template #input-icon>
                      <MdiIcon style="font-size: 20px; color: rgba(95, 95, 95, 0.65);" name="calendar-outline" class="ml-8" />
                    </template>
                  </VueDatePicker>
                </a-col>
                <a-col v-else :span="24" style="text-align: center;">
                  <b>
                    По запросу
                  </b>
                </a-col>
              </a-row>
              <div style="width: 100%;" class="d-flex justify-center">
                <a-button type="dashed" class="d-flex align-center" @click="times[i].push(null)">
                  <MdiIcon name="clock-outline" size="18px" class="mr-4" />
                  добавить время
                </a-button>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </a-col>
      </a-row>
    </a-col> -->
  </a-row>
</template>
<!-- GLOBAL STYLES -->
<style lang="scss">

</style>