<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useTrips } from '../../stores/trips.js'

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

let time = ref([]);
let query = ref("");

let loading = ref(false)

let visible = ref(false);

function find() {
  query.value = query.value.trim()
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
    localStorage.setItem("filterDate", filterTime)
    tripStore.fetchTrips(query.value, start, end);
  } else {
    tripStore.fetchTrips(
      query.value,
      "",
      "",
    );
  }
}


onMounted(() => {
  if(localStorage.getItem("filterDate")){
    let arr = localStorage.getItem("filterDate").split(',');
  arr.forEach(element => {
    dayjs(element)
  })  
  console.log(arr);
  }
  // time.value = localStorage.getItem("filterDate") ?? '';
  if (props.search) {
    query.value = props.search;
  }
});
</script>
<template>
  <a-row type="flex" justify="center" align="middle" class="section_bg ">
    <a-col :xs="22" :md="12">
      <a-row class="mb-8" type="flex" justify="center">
        <a-col :xs="24" :md="12" class="d-flex">
          <a-input-search v-model:value="query" placeholder="поиск" enter-button style="z-index: 0" @search="find()" />
          <span class="mdi mdi-24px mdi-filter-outline ml-16" :class="{ active_filter: visible, filter: !visible }"
            @click="visible = !visible"></span>
        </a-col>
      </a-row>
      <Transition name="fade">
        <div v-if="visible">
          <a-row type="flex" justify="center" class="mt-16">
            <a-col :xs="24" :md="12">
              <a-range-picker style="width: 100%" v-model:value="time" :locale="ruLocale" />
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" class="mt-8">
            <a-button @click="find" type="primary" class="lets_go_btn">поиск</a-button>
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
</style>
