<script setup>
import { ref, onMounted, watch, computed, reactive, nextTick } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useExcursion } from "../../stores/excursion.js";
import { useAppState } from "../../stores/appState";
import { useLocations } from '../../stores/locations.js'
const appStateStore = useAppState()

import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import localeData from "dayjs/plugin/localeData";
import updateLocale from "dayjs/plugin/updateLocale";
import ruRU from "ant-design-vue/es/locale/ru_RU";
import ExcursionService from "../../service/ExcursionService.js";

dayjs.extend(objectSupport);
dayjs.extend(localeData);
dayjs.extend(updateLocale);

import "dayjs/locale/ru";

dayjs.locale("ru");


let props = defineProps({
  search: String,
});
const excursionStore = useExcursion();
const locationsStore = useLocations()
const excursionTypes = ref([]);
let cursor = 1

let filter = reactive({
  start: '',
  end: '',
  query: '',
  type: '',
  directionType: '',
  directionPlace: '',
  minAge: '',
  havePrices: false,
  withTimes: 'все'

})

let isFilterShow = ref(false);

let isCalendarVisible = ref(false);
let selectedDate = ref(undefined);
let activeDate = ref(null);
let excursionDatesForCalendar = ref([]);

const locale = ruRU;

function openCalendar() {
  isCalendarVisible.value = true;
  loadCalendarDates();
}

async function loadCalendarDates() {
  let locationId = locationsStore.location._id ? locationsStore.location._id : '';
  try {
    let response = await ExcursionService.getAll(locationId, 1, {});
    let dates = [];
    response.data.forEach(excursion => {
      excursion.dates?.forEach(dateObj => {
        if (dateObj.date) {
          dates.push(dateObj.date);
        }
      });
    });
    let uniqueMap = new Map();
    dates.forEach(d => {
      let key = `${d.year}-${d.month}-${d.day}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, d);
      }
    });
    excursionDatesForCalendar.value = [...uniqueMap.values()];
  } catch (err) {
    console.log(err);
  }
}

function getExcursionsForDate(currentDate) {
  let c = dayjs(currentDate);
  return excursionDatesForCalendar.value.filter(d => {
    return d.year === c.year() && d.month === c.month() && d.day === c.date();
  });
}

function onCalendarDateSelect(date) {
  let clickedDate = dayjs(date).startOf("day");
  if (activeDate.value && activeDate.value.isSame(clickedDate)) {
    activeDate.value = null;
    filter.start = '';
    filter.end = '';
  } else {
    activeDate.value = clickedDate;
    filter.withTimes = 'с датами';
    filter.start = clickedDate.startOf("day").toDate();
    filter.end = clickedDate.endOf("day").toDate();
  }
  find();
  isCalendarVisible.value = false;
}

let excursionType = reactive({
  type: '',
  directionType: '',
  directionPlace: ''
})


function showFilter() {
  isFilterShow.value = true
}
function hideFilter() {
  isFilterShow.value = false
}

function endOfDayUTC(date) {
  const local = new Date(date)
  local.setHours(23, 59, 59, 999)

  return new Date(Date.UTC(
    local.getFullYear(),
    local.getMonth(),
    local.getDate(),
    local.getHours(),
    local.getMinutes(),
    local.getSeconds(),
    local.getMilliseconds()
  ))
}

function find() {
  let locationId = locationsStore.location._id ? locationsStore.location._id : ''

  excursionStore.getAll(locationId, cursor, filter);
}

function resetForm() {

  Object.assign(excursionType, {
    type: "",
    directionType: "",
    directionPlace: ""
  })
  filter.start = ''
  filter.end = ''
  filter.query = ''
  filter.minAge = ''
  filter.withTimes = 'все'
  filter.havePrices = false
  filter.type = ''
  filter.directionType = ''
  filter.directionPlace = ''


  find();
}

const clearData = (dateNumber) => {
  let date = new Date(dateNumber).toLocaleDateString("ru-Ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  if (date !== "Invalid Date" && date) {
    return date;
  }
  return "";
};

let filterString = computed(() => {
  let keyString = ''
  for (let key in filter) {
    if (key == 'start' && filter[key]) {
      keyString = keyString + `c ${clearData(filter[key])}, `
      continue;
    }
    if (key == 'end' && filter[key]) {
      keyString = keyString + `по ${clearData(filter[key])}, `
      continue;
    }
    if (key == 'minAge' && filter[key]) {
      keyString = keyString + `от ${filter[key]} лет, `
      continue;
    }
    if (key == 'havePrices' && filter[key]) {
      keyString = keyString + `бесплатно, `
      continue;
    }

    if (filter[key]) {

      keyString = keyString + `${filter[key]}, `
    }
  }
  return keyString.trim().slice(0, -1)
})

let buttonTitle = computed(() => {
  return filterString.value ? filterString.value : "Куда, когда?"
}
)
let getExcursionDirections = computed(() => {
  let type = excursionTypes.value.filter((type) => {
    return type.type == excursionType.type
  })
  return type[0]?.direction
})
let getExcursionPlace = computed(() => {
  if (getExcursionDirections.value) {
    let direction = getExcursionDirections.value.filter((direction) => {
      return direction.directionType == excursionType.directionType
    })
    return direction[0]?.directionPlace
  }
  return null

})

let isRestoring = ref(false)
watch(() => excursionType.type, () => {
  if (isRestoring.value) return
  filter.type = excursionType.type
  excursionType.directionType = ''
  excursionType.directionPlace = ''
})
watch(() => excursionType.directionType, () => {
  if (isRestoring.value) return
  filter.directionType = excursionType.directionType
  excursionType.directionPlace = ''
})
watch(() => excursionType.directionPlace, () => {
  if (isRestoring.value) return
  filter.directionPlace = excursionType.directionPlace

})
watch(filter, () => {
  if (filter.withTimes != 'с датами') {
    filter.start = ''
    filter.end = ''
  }
  localStorage.setItem('excurtionsFilterForm', JSON.stringify(filter))
})
watch(() => locationsStore.location?._id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    find()
  }
})

onMounted(async () => {
  await appStateStore.refreshState();
  excursionTypes.value = appStateStore.appState[0]?.excursionTypes || [];

  let localFilter = localStorage.getItem('excurtionsFilterForm')
  if (localFilter) {
    let storageFilter = JSON.parse(localFilter)
    for (const key in filter) {
      if (key in storageFilter) {
        filter[key] = storageFilter[key]
      }
    }
    isRestoring.value = true
    excursionType.type = storageFilter.type
    excursionType.directionType = storageFilter.directionType
    excursionType.directionPlace = storageFilter.directionPlace
    nextTick(() => {
      isRestoring.value = false
    })
  }
  if (props.search) {
    filter.query = props.search;
  }
  if (!excursionStore.excursions.length) {
    find()
  }

});
</script>

<template>

  <a-row class="d-flex justify-center">
    <a-col :xs="24" :lg="12" :md="16" class="pa-16">
      <div style="background: #239fca; padding: 10px; border-radius: 12px; display: flex; align-items: center">
        <div color="#239FCA" @click="showFilter" class="filter-button" type="button">
          {{ buttonTitle }}
        </div>
        <MdiIcon @click="openCalendar"
          style="font-size: 24px; margin-left: 8px; cursor: pointer; color: white" name="calendar-range-outline" />
        <a-button type="primary" shape="circle" class="ml-8 d-flex justify-center align-center"  v-if="filterString" @click="resetForm">
          <MdiIcon name="close" />
        </a-button>
      </div>
    </a-col>
  </a-row>
  <a-modal v-model:open="isFilterShow" title="Поиск экскурсии" :zIndex=900>
    <a-row :gutter="[8, 8]" class="d-flex justify-center flex-wrap">
      <a-col :span="24">

        <a-radio-group v-model:value="filter.withTimes">
          <a-radio value="с датами">C датами</a-radio>
          <a-radio value="для заказа">Для заказа</a-radio>
          <a-radio value="все">Все</a-radio>

        </a-radio-group>
      </a-col>
      <a-col :span="24">
        <a-input v-model:value="filter.query" placeholder="название, содержание?" name="search"
          style="z-index: 0; width: 100%; margin-bottom: 6px" />

      </a-col>
      <a-col :span="24" class="d-flex direction-column">

        <div style="font-size: 10px; line-height: 10px">вид экскурсии</div>
        <a-select v-model:value="excursionType.type">
          <a-select-option value=""></a-select-option>
          <a-select-option placeholder="Вид экскурсии" v-for="excursionType in excursionTypes"
            :value="excursionType.type">
            {{ excursionType.type }}
          </a-select-option>
        </a-select>
      </a-col>

      <a-col :span="24" class="d-flex direction-column" v-if="excursionType.type">
        <div style="font-size: 10px; line-height: 10px">направление</div>
        <a-select v-model:value="excursionType.directionType" style="width: 100%;">
          <a-select-option value=""></a-select-option>
          <a-select-option placeholder="Tип тура" v-for="excursionDirection in getExcursionDirections"
            :value="excursionDirection.directionType">
            {{ excursionDirection.directionType }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="24" class="d-flex direction-column" v-if="excursionType.directionType">
        <div style="font-size: 10px; line-height: 10px">место</div>
        <a-select v-model:value="excursionType.directionPlace" style="width: 100%;">
          <a-select-option value=""></a-select-option>
          <a-select-option placeholder="Tип тура" v-for="directionPlace in getExcursionPlace" :value="directionPlace">
            {{ directionPlace }}
          </a-select-option>
        </a-select>
      </a-col>


      <a-col :span="24" class="d-flex  space-between" v-if="filter.withTimes == 'с датами'">

        <div class="d-flex direction-column" style="width: 100%">
          <div style="font-size: 10px; line-height: 10px">от</div>
          <div style="display: flex; flex-direction: row">
            <VueDatePicker v-model="filter.start" locale="ru-Ru" calendar-class-name="dp-custom-calendar"
              placeholder="дата" calendar-cell-class-name="dp-custom-cell" cancel-text="отмена" select-text="выбрать"
              :min-date="new Date()" :enable-time-picker="false" format="dd/MM/yyyy" auto-apply>
              <template #input-icon>
                <MdiIcon style="font-size: 20px; color: rgba(95, 95, 95, 0.65)" name="calendar-outline" class="ml-8" />
              </template>
            </VueDatePicker>
          </div>
        </div>
      </a-col>


      <a-col :span="24" class="d-flex space-between" v-if="filter.withTimes == 'с датами'">

        <div class="d-flex direction-column" style="width: 100%">
          <div style="font-size: 10px; line-height: 10px">до</div>
          <div style="display: flex; flex-direction: row">
            <VueDatePicker v-model="filter.end" locale="ru-Ru" calendar-class-name="dp-custom-calendar"
              placeholder="дата" calendar-cell-class-name="dp-custom-cell" cancel-text="отмена" select-text="выбрать"
              :min-date="new Date()" :enable-time-picker="false" format="dd/MM/yyyy" auto-apply>
              <template #input-icon>
                <MdiIcon style="font-size: 20px; color: rgba(95, 95, 95, 0.65)" name="calendar-outline" class="ml-8" />
              </template>
            </VueDatePicker>
          </div>

        </div>
      </a-col>
      <a-col :span="12" class="d-flex direction-column">

        <div style="font-size: 10px; line-height: 10px">мин. возраст</div>
        <a-input v-model:value="filter.minAge" placeholder="12" style="z-index: 0; width: 100%;" />

      </a-col>

      <a-col :span="12" class="d-flex justify-center align-center">


        <a-checkbox v-model:checked="filter.havePrices"> Только бесплатные </a-checkbox>

      </a-col>

    </a-row>





    <template #footer>
      <a-button key="submit" style="border-radius: 18px" type="primary"
        @click="hideFilter(), find()">Показать</a-button>
      <a-button key="back" style="border-radius: 18px" @click="resetForm(), hideFilter()">Очистить</a-button>
    </template>
  </a-modal>
  <a-modal v-model:open="isCalendarVisible" title="Выберите дату" :zIndex=900 :footer="null">
    <a-config-provider :locale="locale">
      <a-calendar :value="selectedDate" @select="onCalendarDateSelect">
        <template #dateCellRender="{ current }">
          <div class="date-cell">
            <span v-if="getExcursionsForDate(current).length > 0">
              {{ getExcursionsForDate(current).length }}
            </span>
          </div>
        </template>
      </a-calendar>
    </a-config-provider>
  </a-modal>
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

.filter-button {
  background: white;
  border-color: #239fca;
  border-radius: 8px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.7);
}

.date-cell {
  text-align: center;
  color: #fc4f06;
  font-weight: bold;
}
</style>
