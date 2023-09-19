<script setup>
import { ref, onMounted } from "vue";
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

const router = useRouter();
const tripStore = useTrips();
const appStore = useAppState();

let time = ref(null);
let query = ref("");
let type = ref("");

let loading = ref(false)

let visible = ref(false);

function find() {
  query.value = query.value.trim()
  localStorage.setItem("TripQuery", query.value)
  localStorage.setItem("TripType", type.value)
  tripStore.searchCursor = 1
  tripStore.filteredTrips = []
  tripStore.cursor = 1
  tripStore.trips = []
  if (time.value) {
    let start = new Date(time.value[0].$d)
    let end = new Date(time.value[1].$d)

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
    let filterTime = [start, end]
    localStorage.setItem("TripfilterDate", filterTime)
    tripStore.fetchTrips(query.value, start, end, type.value);
  } else {
    localStorage.setItem("TripfilterDate", '')
    tripStore.fetchTrips(
      query.value,
      "",
      "",
      type.value,
    );
  }
}

function resetForm() {
  time.value = '';
  query.value = '';
  type.value = '';
  find()
}


onMounted(() => {
  query.value = localStorage.getItem("TripQuery") ?? '';
  type.value = localStorage.getItem("TripType") ?? '';
  if (localStorage.getItem("TripfilterDate")) {
    let arr = localStorage.getItem("TripfilterDate").split(',').map(function (date) {
      return dayjs(new Date(+date))
    });
    time.value = arr
  }
  if (props.search) {
    query.value = props.search;
  }
});
</script>
<template>
  <a-row type="flex" justify="center" align="middle" class="section_bg ">
    <a-col :xs="22" :md="12">
      <a-row class="mb-4" justify="center">
        <a-col :xs="24" :md="12" class="d-flex">
          <a-input-search v-model:value="query" placeholder="поиск" enter-button style="z-index: 0" @search="find()" />
          <span class="ml-16 mdi mdi-24px mdi-filter-outline" :class="{ active_filter: visible, filter: !visible }"
            @click="visible = !visible">
          </span>
        </a-col>
      </a-row>
      <Transition name="fade">
        <div v-if="visible">
          <a-row class="mb-8" type="flex" justify="center" :xs="24" :md="12">
            <a-col :xs="24" :md="12">
              <a-range-picker style="width: 100%" v-model:value="time" :locale="ruLocale" />
            </a-col>
          </a-row>
          <a-row type="flex" justify="center">
            <a-col :xs="24" :md="12">
              <a-select placeholder="Tип тура" v-model:value="type" style="width: 100%">
                <a-select-option v-for="   tripType    in    appStore.appState[0].tripType   " :value="tripType">{{
                  tripType
                }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" class="mt-16 mb-8">
            <a-button @click="find" type="primary" class="lets_go_btn">поиск</a-button>
            <a-button @click="resetForm" style="border-radius: 15px; margin-left: 10px;">отчистить</a-button>
          </a-row>
        </div>
      </Transition>
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

.a-button {}
</style>
