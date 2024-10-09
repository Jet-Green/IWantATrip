<script setup>
import { ref, onMounted, watch, computed, reactive } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import VueDatePicker from "@vuepic/vue-datepicker";
import datePlugin from "../../plugins/dates";
import "@vuepic/vue-datepicker/dist/main.css";
import { useExcursion } from "../../stores/excursion.js";
import { useAppState } from "../../stores/appState";

const appStateStore = useAppState()

import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
dayjs.extend(objectSupport);
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import "dayjs/locale/ru";
import { boolean } from "yup";
dayjs.locale("ru");
let breakpoints = useBreakpoints(breakpointsTailwind);

let sm = breakpoints.smaller("md");

const ruLocale = locale;

let props = defineProps({
  search: String,
});

const excursionStore = useExcursion();

const excursionTypes = ref([]);

let time = reactive({
  start: "",
  end: "",
});
let query = ref("");
let excursionType = reactive({
  type: '',
  directionType: '',
  directionPlace: ''
})
let minAge = ref("")
let havePrices = ref(false)


function find() {
  query.value = query.value.trim();
  localStorage.setItem("ExcursionQuery", query.value);
  localStorage.setItem("ExcursionMinAge", minAge.value);
  localStorage.setItem("ExcursionHavePrices", havePrices.value);
  localStorage.setItem("ExcursionType", excursionType.type);
  localStorage.setItem("ExcursionDirectionType", excursionType.directionType);
  localStorage.setItem("ExcursionDirectionPlace", excursionType.directionPlace);
  excursionStore.searchCursor = 1;
  excursionStore.cursor = 1;
  excursionStore.excursions = [];
  if (time.start) {
    let start = time.start
    localStorage.setItem("ExcursionTimeStart", start);
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    start.setMilliseconds(0);
    excursionStore.excursionFilter.start = start;
  }
  if (time.end) {
    let end = time.end
    localStorage.setItem("ExcursionTimeEnd", end);
    end.setHours(0);
    end.setMinutes(0);
    end.setSeconds(0);
    end.setMilliseconds(0);
    excursionStore.excursionFilter.end = end;
  }
  excursionStore.excursionFilter.query = query.value;
  excursionStore.excursionFilter.type = excursionType.type
  excursionStore.excursionFilter.directionType = excursionType.directionType
  excursionStore.excursionFilter.directionPlace = excursionType.directionPlace
  excursionStore.excursionFilter.minAge = minAge.value
  excursionStore.excursionFilter.havePrices = havePrices.value
  excursionStore.getAll();
}

function resetForm() {
  Object.assign(time, {
    start: "",
    end: "",
  });
  Object.assign(excursionType, {
    type: "",
    directionType: "",
    directionPlace: ""
  });
  excursionStore.excursionFilter.query = "";
  excursionStore.excursionFilter.start = "";
  excursionStore.excursionFilter.end = "";
  excursionStore.excursionFilter.type = "";
  excursionStore.excursionFilter.directionType = "";
  excursionStore.excursionFilter.directionPlace = "";
  excursionStore.excursionFilter.minAge = ""
  excursionStore.excursionFilter.havePrices = false
  query.value = "";
  minAge.value = "";
  havePrices.value = false;

  localStorage.setItem("ExcursionTimeStart", "");
  localStorage.setItem("ExcursionTimeEnd", "");
  localStorage.setItem("ExcursionQuery", "");
  localStorage.setItem("ExcursionType", "");
  localStorage.setItem("ExcursionDirectionType", "");
  localStorage.setItem("ExcursionDirectionPlace", "");
  localStorage.setItem("ExcursionMinAge", "");
  localStorage.setItem("ExcursionHavePrices", false);

  find();
}

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

watch(() => excursionType.type, () => {
  excursionType.directionType = ''
  excursionType.directionPlace = ''
})
watch(() => excursionType.directionType, () => {
  excursionType.directionPlace = ''
})
watch(havePrices, () => {
  find()
})
onMounted(async () => {

  await appStateStore.refreshState();

  excursionTypes.value = appStateStore.appState[0]?.excursionTypes || [];

  query.value = localStorage.getItem("ExcursionQuery") ?? "";
  minAge.value = localStorage.getItem("ExcursionMinAge") ?? "";
  excursionType.type = localStorage.getItem("ExcursionType") ?? "";
  excursionType.directionType = localStorage.getItem("ExcursionDirectionType") ?? "";
  excursionType.directionPlace = localStorage.getItem("ExcursionDirectionPlace") ?? "";
  minAge.value = localStorage.getItem("ExcursionMinAge") ?? "";
  havePrices.value = (localStorage.getItem("ExcursionHavePrices") === 'true') ?? false;

  if (localStorage.getItem("ExcursionTimeStart")) {
    time.start = new Date(localStorage.getItem("ExcursionTimeStart"))
    time.end = new Date(localStorage.getItem("ExcursionTimeEnd"))
  }
  if (props.search) {
    query.value = props.search;
  }
  query.value ? find() : null;
  (query.value || excursionType.type || minAge.value || havePrices.value) ? find() : null;
  //Надо обязательно вводить дату, иначе ошибка
});
</script>

<template>
  <!-- <span class="ml-16 mdi mdi-24px mdi-filter-outline" :class="{ active_filter: visible, filter: !visible }"
    @click="visible = !visible">
  </span> -->

  <a-row class="section_bg">
    <a-col :xs="24">
      <a-row :gutter="[8, 8]" class="d-flex justify-center flex-wrap">
        <a-col :span="24" :md="6" class="d-flex direction-column">

          <div for="search" style="font-size: 10px; line-height: 10px">поиск</div>
          <a-input v-model:value="query" placeholder="по названию, содержанию" name="search"
            style="z-index: 0; width: 100%; margin-bottom: 6px" />

        </a-col>
        <a-col :span="24" :md="6" class="d-flex direction-column">

          <div style="font-size: 10px; line-height: 10px">мин. возраст</div>
          <a-input v-model:value="minAge" placeholder="12" style="z-index: 0; width: 100%;" />

        </a-col>

        <a-col :span="24" :md="6" class="d-flex  space-between">

          <div class="d-flex direction-column" style="width: 100%">
            <div style="font-size: 10px; line-height: 10px">от</div>
            <div style="display: flex; flex-direction: row">
              <VueDatePicker v-model="time.start" locale="ru-Ru" calendar-class-name="dp-custom-calendar"
                placeholder="дата" calendar-cell-class-name="dp-custom-cell" cancel-text="отмена" select-text="выбрать"
                :min-date="new Date()" :enable-time-picker="false" format="dd/MM/yyyy">
                <template #input-icon>
                  <span style="font-size: 20px; color: rgba(95, 95, 95, 0.65)"
                    class="mdi mdi-calendar-outline ml-8"></span>
                </template>
              </VueDatePicker>
            </div>
          </div>
        </a-col>

        <a-col :span="24" :md="6" class="d-flex space-between">

          <div class="d-flex direction-column" style="width: 100%">
            <div style="font-size: 10px; line-height: 10px">до</div>
            <div style="display: flex; flex-direction: row">
              <VueDatePicker v-model="time.end" locale="ru-Ru" calendar-class-name="dp-custom-calendar"
                placeholder="дата" calendar-cell-class-name="dp-custom-cell" cancel-text="отмена" select-text="выбрать"
                :min-date="new Date()" :enable-time-picker="false" format="dd/MM/yyyy">
                <template #input-icon>
                  <span style="font-size: 20px; color: rgba(95, 95, 95, 0.65)"
                    class="mdi mdi-calendar-outline ml-8"></span>
                </template>
              </VueDatePicker>
            </div>

          </div>
        </a-col>
      </a-row>
    </a-col>
  </a-row>


  <a-row :gutter="[8, 8]" class="d-flex flex-wrap">

    <a-col :span="24" :md="6" class="d-flex justify-center align-center">


      <a-checkbox v-model:checked="havePrices"> Бесплатно</a-checkbox>

    </a-col>
    <a-col :span="24" :md="6" class="d-flex direction-column">
      <div style="font-size: 10px; line-height: 10px">вид экскурсии</div>
      <a-select v-model:value="excursionType.type">
        <a-select-option value=""></a-select-option>
        <a-select-option placeholder="Вид экскурсии" v-for="excursionType in excursionTypes"
          :value="excursionType.type">
          {{ excursionType.type }}
        </a-select-option>
      </a-select>
    </a-col>

    <a-col :span="24" :md="6" class="d-flex direction-column" v-if="(excursionType.type)">
      <div style="font-size: 10px; line-height: 10px">направление</div>
      <a-select v-model:value="excursionType.directionType" style="width: 100%;">
        <a-select-option value=""></a-select-option>
        <a-select-option placeholder="Tип тура" v-for="excursionDirection in getExcursionDirections"
          :value="excursionDirection.directionType">
          {{ excursionDirection.directionType }}
        </a-select-option>
      </a-select>
    </a-col>

    <a-col :span="24" :md="6" class="d-flex direction-column" v-if="(excursionType.directionType)">
      <div style="font-size: 10px; line-height: 10px">место</div>
      <a-select v-model:value="excursionType.directionPlace" style="width: 100%;">
        <a-select-option value=""></a-select-option>
        <a-select-option placeholder="Tип тура" v-for="directionPlace in getExcursionPlace" :value="directionPlace">
          {{ directionPlace }}
        </a-select-option>
      </a-select>
    </a-col>



    <a-col :span="24" class="d-flex justify-center mt-16 mb-16">
      <a-button type="primary" shape="round" @click="find" class="mr-4">
   
        найти
      </a-button>
      <a-button shape="round" @click="resetForm">
   
        очистить
      </a-button>
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
