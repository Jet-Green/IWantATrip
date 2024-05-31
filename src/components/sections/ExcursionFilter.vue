<script setup>
import { ref, onMounted, watch, computed } from "vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import datePlugin from '../../plugins/dates'
import '@vuepic/vue-datepicker/dist/main.css'
import { useRouter } from "vue-router";
import { useExcursion } from '../../stores/excursion.js';
import { useAppState } from "../../stores/appState";
import excursionTypes from '../../db/excursionTypes.js'

import dayjs from "dayjs";
import objectSupport from 'dayjs/plugin/objectSupport'
dayjs.extend(objectSupport);
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import 'dayjs/locale/ru';
dayjs.locale('ru');

const ruLocale = locale;

let props = defineProps({
  search: String,
});


const excursionStore = useExcursion();
const appStore = useAppState();

let time = ref([]);
let query = ref("");
let type = ref("");

let router = useRouter();

watch(time, (newTime) => {
  if (!newTime) return
  if (newTime[0] && newTime[1]) {
    let start = new Date(newTime[0].$d)

    localStorage.setItem("ExcursionTimeStart", start)
    find()
  }
  else {
    localStorage.setItem("ExcursionTimeStart", '')
    find()
  }
});

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

function find() {
  query.value = query.value.trim()
  localStorage.setItem("ExcursionQuery", query.value)
  localStorage.setItem("ExcursionType", type.value)
  excursionStore.searchCursor = 1
  excursionStore.cursor = 1
  excursionStore.excursions = []
  if (time.value[0] ?? time.value[1]) {
    let start = new Date(time.value[0].$d)

    localStorage.setItem("ExcursionTimeStart", start)

    start.setHours(0)
    start.setMinutes(0)
    start.setSeconds(0)
    start.setMilliseconds(0)

    start = Number(Date.parse(start.toString()));

    excursionStore.excursionFilter.query = query.value
    excursionStore.excursionFilter.start = getDate(start)
    excursionStore.excursionFilter.type = type.value
    excursionStore.getAll();
  } else {
    excursionStore.excursionFilter.query = query.value
    excursionStore.excursionFilter.start = ""
    excursionStore.excursionFilter.type = type.value
    excursionStore.getAll();
  }
}

function resetForm() {
  excursionStore.excursionFilter.query = ""
  excursionStore.excursionFilter.start = ""
  excursionStore.excursionFilter.type = ""
  type.value = ""
  time.value = [];
  query.value = '';

  localStorage.setItem("ExcursionTimeStart", "")
  localStorage.setItem("ExcursionQuery", "")
  localStorage.setItem("ExcursionType", "")

  find()
}

onMounted(() => {
  query.value = localStorage.getItem("ExcursionQuery") ?? '';
  type.value = localStorage.getItem("ExcursionType") ?? '';

  if (localStorage.getItem("ExcursionTimeStart")) {
    time.value[0] = dayjs(localStorage.getItem("ExcursionTimeStart"))
  }

  if (props.search) {
    query.value = props.search;
  }
  query.value || type.value ? find() : null
  //Надо обязательно вводить дату, иначе ошибка
});

</script>

<template>
  <!-- <span class="ml-16 mdi mdi-24px mdi-filter-outline" :class="{ active_filter: visible, filter: !visible }"
    @click="visible = !visible">
  </span> -->

  <a-row type="flex" justify="center" class="section_bg ">
    <a-col :xs="22" :lg="16">

      <a-row :gutter="[8, 4]" class="d-flex justify-center align-center flex-wrap">
        <a-col :span="12" :md="6" class="d-flex direction-column">
          <div for="search" style="font-size:10px; line-height:10px; ">искать</div>
          <a-input v-model:value="query" placeholder="сочи" name="search" style="z-index: 0; width:100%" />
        </a-col>

        <a-col :span="12" :md="6" class="d-flex direction-column" v-if="appStore.appState">
          <div style="font-size:10px; line-height:10px">вид тура</div>
          <a-select v-model:value="type">
            <a-select-option value=""></a-select-option>
            <a-select-option placeholder="Tип тура" v-for="excursionType in excursionTypes" :value="excursionType.type">
              {{ excursionType.type }}
            </a-select-option>
          </a-select>
        </a-col>

        <a-col :span="24" :md="12" class="d-flex align-center space-between">
          <div class="d-flex direction-column" style="width: 100%">
            <div style="font-size:10px; line-height:10px">даты</div>
            <VueDatePicker v-model="time" locale="ru-Ru" calendar-class-name="dp-custom-calendar"
              placeholder="выберите дату" calendar-cell-class-name="dp-custom-cell" cancel-text="отмена"
              select-text="выбрать" :min-date="new Date()" :enable-time-picker="false" format="dd/MM/yyyy">
              <template #input-icon>
                <span style="font-size: 20px; color: rgba(95, 95, 95, 0.65);"
                  class="mdi mdi-calendar-outline ml-8"></span>
              </template>
            </VueDatePicker>
          </div>
        </a-col>


        <a-col :span="24" class="d-flex justify-center mt-16 mb-16">
          <a-button type="primary" shape="round" @click="find" class="mr-4">
            <!-- <span class=" mdi mdi-magnify">
              </span> -->
            найти
          </a-button>
          <a-button shape="round" @click="resetForm">
            <!-- <span class=" mdi mdi-close">
              </span> -->
            очистить
          </a-button>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
// .section_bg {
//   background: rgba(67, 65, 79);
// }

.active_filter {
  color: #ff6600;
  cursor: pointer;
}

.filter {
  color: #227597;
  cursor: pointer;
}
</style>
