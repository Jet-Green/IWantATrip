<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import { useCompanions } from "../stores/companions";

import dayjs from "dayjs";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import 'dayjs/locale/ru';
dayjs.locale('ru');

const ruLocale = locale;

const companionStore = useCompanions();
let router = useRouter();
let visible = ref(false);
let date = ref([])
let query = reactive({
  strQuery: "",
  gender: "",
  age: {
    start: "",
    end: ""
  },
  start: "",
  end: "",

})


async function find() {
  query.strQuery = query.strQuery.trim()
  if (query.strQuery.length == 0 || query.strQuery.length > 2) {
    console.log('aboba');
    await companionStore.fetchCompanions(query);
  }
}

watch(query, () => {
  find();
}, { deep: true });
watch(date, (newDate) => {
  if (newDate) {
    if (newDate[1]) {
      let endDate = new Date(date.value[1].$d);
      endDate.setHours(23)
      endDate.setMinutes(59)
      endDate.setSeconds(59)
      endDate.setMilliseconds(999)
      localStorage.setItem("CompanionTimeEnd", endDate)

      query.end = Date.parse(endDate);
    }
    if (newDate[0]) {
      let startDate = new Date(date.value[0].$d);
      startDate.setHours(0)
      startDate.setMinutes(0)
      startDate.setSeconds(0)
      startDate.setMilliseconds(0)
      localStorage.setItem("CompanionTimeStart", startDate)

      query.start = Date.parse(startDate);
    }
  }
  else{
    localStorage.setItem("CompanionTimeEnd", '')
    localStorage.setItem("CompanionTimeStart", '')
    query.start = ''
    query.end = ''
  }
});

onMounted(() => {
  if (localStorage.getItem("CompanionTimeStart")) {

    let dateStart = localStorage.getItem("CompanionTimeStart")
    let dateEnd = localStorage.getItem("CompanionTimeEnd")
    
    date.value[0] = dayjs(dateStart)
    date.value[1] = dayjs(dateEnd)

    query.start = Date.parse(new Date(dateStart))
    query.end = Date.parse(new Date(dateEnd))
    find()
  }
  find()
});
</script>
<template>
  <a-row>

    <a-col :xs="24">
      <a-row type="flex" justify="center">
        <a-col :xs="24" class="d-flex">
          <a-input-search v-model:value="query.strQuery" placeholder="поиск" enter-button style="z-index: 0"
            @search="find()" />
          <span class="mdi mdi-24px mdi-filter-outline ml-16" :class="{ active_filter: visible, filter: !visible }"
            @click="visible = !visible"></span>
        </a-col>

      </a-row>
    </a-col>
    <a-col :xs="24">
      <Transition name="fade">
        <div v-if="visible">
          <a-row class="d-flex justify-center direction-column" :gutter="[4, 4]">
            <a-col :xs="24" class="d-flex direction-column">
              <label for="gender">пол</label>
              <a-select name="gender" v-model:value="query.gender" :bordered="true" class="selector" style="width:100%">
                <a-select-option value=""> </a-select-option>
                <a-select-option v-for="(l, index) of ['Мужчина', 'Женщина']" :value="l" :key="index">
                  {{ l }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :xs="24" class="d-flex direction-column">
              <label for="age">возраст</label>
              <div name="age" class="d-flex align-center label">
                от <a-input type="number" v-model:value="query.age.start" :min="0" />
                до <a-input type="number" v-model:value="query.age.end" :min="0" />
              </div>
            </a-col>

            <a-col :xs="24">
              <label for="date">дата</label>
              <a-range-picker name="date" style="width:100%" v-model:value="date" :locale="ruLocale" />
            </a-col>
            <!-- <a-col :xs="24" class="d-flex justify-center">
                                                            <a-button @click="find" class="lets_go_btn" type="primary">поиск</a-button>
                                                          </a-col> -->

          </a-row>
        </div>
      </Transition>
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
.active_filter {
  color: #ff6600;
  cursor: pointer;
}

.filter {
  color: #227597;
  cursor: pointer;
}

label,
.label {
  font-size: 10px;
}
</style>
