<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useTrips } from '../../stores/trips.js';
import { useAppState } from "../../stores/appState";

import dayjs from "dayjs";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import 'dayjs/locale/ru';
dayjs.locale('ru');

const ruLocale = locale;

let props = defineProps({
  search: String,
});


const tripStore = useTrips();
const appStore = useAppState();

let time = ref([]);
let query = ref("");
let type = ref("");

let router = useRouter();

function toCatalog() {
  router.push(`/catalog`);
}

watch(time, (newTime) => {
  if (!newTime) return
  if (newTime[0] && newTime[1]) {
    let start = new Date(newTime[0].$d)
    let end = new Date(newTime[1].$d)

    localStorage.setItem("TripTimeStart", start)
    localStorage.setItem("TripTimeEnd", end)
    find()
  }
  else {
    localStorage.setItem("TripTimeStart", '')
    localStorage.setItem("TripTimeEnd", '')
    find()
  }
});


function find() {
  query.value = query.value.trim()
  localStorage.setItem("TripQuery", query.value)
  localStorage.setItem("TripType", type.value)
  tripStore.searchCursor = 1
  tripStore.cursor = 1
  tripStore.trips = []
  if (time.value[0] ?? time.value[1]) {
    let start = new Date(time.value[0].$d)
    let end = new Date(time.value[1].$d)

    localStorage.setItem("TripTimeStart", start)
    localStorage.setItem("TripTimeEnd", end)

    start.setHours(0)
    start.setMinutes(0)
    start.setSeconds(0)
    start.setMilliseconds(0)

    start = Number(Date.parse(start.toString()));

    end.setHours(23)
    end.setMinutes(59)
    end.setSeconds(59)
    end.setMilliseconds(999)

    end = Number(Date.parse(end.toString()));
    tripStore.tripFilter.query = query.value
    tripStore.tripFilter.start = start
    tripStore.tripFilter.end = end
    tripStore.tripFilter.type = type.value
    tripStore.fetchTrips();
  } else {
    tripStore.tripFilter.query = query.value
    tripStore.tripFilter.start = ""
    tripStore.tripFilter.end = ""
    tripStore.tripFilter.type = type.value
    tripStore.fetchTrips();
  }
}

function resetForm() {
  tripStore.tripFilter.query = ""
  tripStore.tripFilter.start = ""
  tripStore.tripFilter.end = ""
  tripStore.tripFilter.type = ""
  time.value = [];
  query.value = '';

  localStorage.setItem("TripTimeStart", "")
  localStorage.setItem("TripTimeEnd", "")
  localStorage.setItem("TripQuery", "")
  localStorage.setItem("TripType", "")

  find()
}

onMounted(() => {
  query.value = localStorage.getItem("TripQuery") ?? '';
  type.value = localStorage.getItem("TripType") ?? '';

  if (localStorage.getItem("TripTimeStart")) {
    time.value[0] = dayjs(localStorage.getItem("TripTimeStart"))
    time.value[1] = dayjs(localStorage.getItem("TripTimeEnd"))
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

        <a-col :span="12" :md="6" class="d-flex direction-column">
          <div style="font-size:10px; line-height:10px">вид тура</div>
          <a-select v-model:value="type">
            <a-select-option value=""></a-select-option>
            <a-select-option placeholder="Tип тура" v-for="tripType in appStore.appState[0]?.tripType"
              :value="tripType">
              {{ tripType }}
            </a-select-option>
          </a-select>
        </a-col>

        <a-col :span="24" :md="12" class="d-flex align-center space-between">
          <div class="d-flex direction-column" style="width: 100%">
            <div style="font-size:10px; line-height:10px">даты</div>
            <a-range-picker v-model:value="time" :locale="ruLocale" :placeholder="['начало', 'конец']"
              inputmode='none' />
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
