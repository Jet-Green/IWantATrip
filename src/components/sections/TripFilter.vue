<script setup>
import { ref, onMounted, watchEffect } from "vue";
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

let time = ref(null);
let query = ref("");
let type = ref("");



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

    tripStore.fetchTrips(query.value, start, end, type.value);
  } else {

    tripStore.fetchTrips(
      query.value,
      "",
      "",
      type.value,
    );
  }
}

function resetForm() {
  time.value = null;
  query.value = '';
  type.value = '';
  localStorage.setItem("TripQuery", "")
  localStorage.setItem("TripType", "")

  find()
}

watchEffect(() => {

})

onMounted(() => {
  query.value = localStorage.getItem("TripQuery") ?? '';
  type.value = localStorage.getItem("TripType") ?? '';
  if (props.search) {
    query.value = props.search;
  }
  query.value || type.value ? find() : null

});

</script>
<template>
  <!-- <span class="ml-16 mdi mdi-24px mdi-filter-outline" :class="{ active_filter: visible, filter: !visible }"
    @click="visible = !visible">
  </span> -->

  <a-row type="flex" justify="center" class="section_bg ">
    <a-col :xs="22" :lg="16">

      <a-row :gutter="[8, 4]" class="d-flex justify-center  flex-wrap">
        <a-col class="d-flex direction-column"> 
             <div for="search" style="font-size:10px; line-height:10px">искать</div>
          <a-input v-model:value="query" placeholder="сочи" name="search" style="z-index: 0" />
      
        </a-col>

        <a-col class="d-flex direction-column" >
          <div  style="font-size:10px; line-height:10px">тип тура</div>
          <a-select v-model:value="type" style="min-width:180px"  placeholder="Tags Mode">
            <a-select-option  value="" ></a-select-option>
            <a-select-option placeholder="Tип тура" v-for="   tripType    in    appStore.appState[0].tripType   "
              :value="tripType">{{
                tripType
              }}</a-select-option>
          </a-select>
        </a-col>

        <a-col class="d-flex direction-column">
          <div  style="font-size:10px; line-height:10px">даты</div>
          <a-range-picker v-model:value="time" :locale="ruLocale" />
        </a-col>


        <a-col  class="d-flex align-end">
          <div>
              <a-tooltip title="Искать">
            <a-button type="primary" shape="circle" @click="find">
              <span class=" mdi mdi-magnify">
              </span>


            </a-button>
          </a-tooltip>
          <a-tooltip title="Очистить">
            <a-button shape="circle" @click="resetForm">
              <span class=" mdi mdi-close">
              </span>
              
            </a-button>
          </a-tooltip>
          </div>
        
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
