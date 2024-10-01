<script setup>
import { ref, onMounted, watch, computed } from "vue"
import { useRouter } from "vue-router"
import { useTrips } from "../../stores/trips.js"
import { useAppState } from "../../stores/appState"

import dayjs from "dayjs"
import locale from "ant-design-vue/es/date-picker/locale/ru_RU"
import "dayjs/locale/ru"
dayjs.locale("ru")

const ruLocale = locale

let props = defineProps({
  search: String,
})

const tripStore = useTrips()
const appStore = useAppState()

let time = ref([])
let query = ref("")
let tripRegion = ref("")
let type = ref("")
let locationRadius = ref(Number(localStorage.getItem("locationRadius")) ?? 100)

let radiusVisible = ref(false)

let querySuggestionsVisible = ref(false)
let nearMeSuggestionsVisible = ref(false)

let router = useRouter()

let suggestedRegions = computed(() => {
  return (
    appStore.appState[0].tripRegions?.filter((reg) =>
      reg.toLowerCase().includes(tripRegion.value.trim().toLocaleLowerCase())
    ) ?? []
  )
})

watch(time, (newTime) => {
  if (!newTime) return
  if (newTime[0] && newTime[1]) {
    let start = new Date(newTime[0].$d)
    let end = new Date(newTime[1].$d)

    localStorage.setItem("TripTimeStart", start)
    localStorage.setItem("TripTimeEnd", end)
    find()
  } else {
    localStorage.setItem("TripTimeStart", "")
    localStorage.setItem("TripTimeEnd", "")
    find()
  }
})

function hideQuerySuggestions() {
  querySuggestionsVisible.value = false
  tripRegion.value = ""
}

function showQuerySuggestions() {
  tripRegion.value = query.value
  querySuggestionsVisible.value = true
}

let regionSelected = ref(false)
function selectRegion(regionName) {
  tripRegion.value = regionName
  query.value = regionName
  regionSelected.value = true
}

function find() {
  query.value = query.value.trim()
  localStorage.setItem("TripQuery", query.value)
  localStorage.setItem("TripType", type.value)
  tripStore.searchCursor = 1
  tripStore.cursor = 1
  tripStore.trips = []

  tripStore.tripFilter.tripRegion = tripRegion.value
  tripStore.tripFilter.locationRadius = locationRadius.value
  if (time.value[0] ?? time.value[1]) {
    let start = new Date(time.value[0].$d)
    let end = new Date(time.value[1].$d)

    localStorage.setItem("TripTimeStart", start)
    localStorage.setItem("TripTimeEnd", end)

    start.setHours(0)
    start.setMinutes(0)
    start.setSeconds(0)
    start.setMilliseconds(0)

    start = Number(Date.parse(start.toString()))

    end.setHours(23)
    end.setMinutes(59)
    end.setSeconds(59)
    end.setMilliseconds(999)

    end = Number(Date.parse(end.toString()))
    tripStore.tripFilter.query = query.value
    tripStore.tripFilter.start = start
    tripStore.tripFilter.end = end
    tripStore.tripFilter.type = type.value
    tripStore.fetchTrips()
  } else {
    tripStore.tripFilter.query = query.value
    tripStore.tripFilter.start = ""
    tripStore.tripFilter.end = ""
    tripStore.tripFilter.type = type.value
    tripStore.fetchTrips()
  }
}

function resetForm() {
  tripStore.tripFilter.query = ""
  tripStore.tripFilter.start = ""
  tripStore.tripFilter.end = ""
  tripStore.tripFilter.type = ""
  type.value = ""
  time.value = []
  query.value = ""

  localStorage.setItem("TripTimeStart", "")
  localStorage.setItem("TripTimeEnd", "")
  localStorage.setItem("TripQuery", "")
  localStorage.setItem("TripType", "")

  find()
}

function saveLocationRadius() {
  localStorage.setItem("locationRadius", locationRadius.value)
  radiusVisible.value = false
}

watch(query, () => {
  if (query.value.length > 2) {
    showQuerySuggestions()
  }
})

onMounted(() => {
  query.value = localStorage.getItem("TripQuery") ?? ""
  type.value = localStorage.getItem("TripType") ?? ""

  if (localStorage.getItem("TripTimeStart")) {
    time.value[0] = dayjs(localStorage.getItem("TripTimeStart"))
    time.value[1] = dayjs(localStorage.getItem("TripTimeEnd"))
  }

  if (props.search) {
    query.value = props.search
  }
  query.value || type.value ? find() : null
  //Надо обязательно вводить дату, иначе ошибка
})
</script>

<template>
  <!-- <span class="ml-16 mdi mdi-24px mdi-filter-outline" :class="{ active_filter: visible, filter: !visible }"
    @click="visible = !visible">
  </span> -->

  <a-row type="flex" justify="center" class="section_bg">
    <a-col :xs="22" :lg="16">
      <a-row :gutter="[8, 4]" class="d-flex justify-center align-center flex-wrap">
        <a-col :span="12" :md="6" class="d-flex direction-column">
          <div for="search" style="font-size: 10px; line-height: 10px">искать</div>
          <a-input
            v-model:value="query"
            placeholder="сочи"
            name="search"
            style="width: 100%"
            allowClear
            autocomplete="off"
          />

          <!-- <Transition name="fade">
            <div class="query-suggestions" v-if="querySuggestionsVisible">
              <div class="card" v-if="!nearMeSuggestionsVisible">

                <span class="mdi mdi-close" @click="hideQuerySuggestions"></span>

                <a-button variant="outlined" class="location-btn" @click="radiusModal = true">
                  <span class="mdi mdi-map-marker-radius-outline"></span>
                  туры рядом со мной</a-button
                >
                <b>
                  радиус поиска {{ locationRadius }} км.
                </b>
                <hr class="mt-16 mb-16" />
                <div>
                  <div v-if="suggestedRegions.length > 0" v-for="region of suggestedRegions">
                    <div class="region-container" @click="selectRegion(region)">
                      <div>
                        {{ region }}
                      </div>
                      <div>
                        <span class="mdi mdi-check"></span>
                      </div>
                    </div>
                  </div>
                  <div v-else>Ничего не нашлось</div>
                </div>
              </div>
              <div v-else class="card">
                <b> Радиус поиска {{ locationRadius }} км. </b>
                <a-slider
                  v-model:value="locationRadius"
                  :step="100"
                  :min="100"
                  :max="1800"
                  tooltipPlacement="bottom"
                  :tipFormatter="(s) => s + ' км'"
                  class="mt-32"
                />
                <span class="mdi mdi-close" @click="nearMeSuggestionsVisible = false"></span>
                <a-button style="border-radius: 18px" @click="hideQuerySuggestions">готово</a-button>
              </div>
            </div>
          </Transition> -->
        </a-col>

        <a-modal v-model:open="querySuggestionsVisible" title="Регион">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <a-input
                v-model:value="tripRegion"
                placeholder="сочи"
                name="search"
                style="width: 100%"
                allowClear
                autocomplete="off"
              />
            </a-col>

            <a-col :span="24">
              <a-button v-if="!radiusVisible" variant="outlined" class="location-btn" @click="radiusVisible = true">
                <span class="mdi mdi-map-marker-radius-outline"></span>
                туры рядом со мной</a-button
              >
              <div v-if="radiusVisible">
                <a-slider
                  v-model:value="locationRadius"
                  :step="100"
                  :min="100"
                  :max="1800"
                  tooltipPlacement="right"
                  :tipFormatter="(s) => s + ' км'"
                />
                <b>Радиус поиска {{ locationRadius }} км.</b>
              </div>
            </a-col>

            <a-col :span="24">
              <hr class="mt-16 mb-16" />
              <div>
                <div v-if="suggestedRegions.length > 0" v-for="region of suggestedRegions">
                  <div class="region-container" @click="selectRegion(region)">
                    <div>
                      {{ region }}
                    </div>
                    <div>
                      <span class="mdi mdi-check"></span>
                    </div>
                  </div>
                </div>
                <div v-else>Ничего не нашлось</div>
              </div>
            </a-col>
          </a-row>

          <template #footer>
            <a-button key="back" style="border-radius: 18px" @click="hideQuerySuggestions()">оставить поиск строкой</a-button>
            <a-button
              key="submit"
              :disabled="!regionSelected"
              style="border-radius: 18px"
              type="primary"
              @click="saveLocationRadius(), hideQuerySuggestions(), find()"
              >применить</a-button
            >
          </template>
        </a-modal>

        <a-col :span="12" :md="6" class="d-flex direction-column" v-if="appStore.appState">
          <div style="font-size: 10px; line-height: 10px">вид тура</div>
          <a-select v-model:value="type">
            <a-select-option value=""></a-select-option>
            <a-select-option
              placeholder="Tип тура"
              v-for="tripType in appStore.appState[0]?.tripType"
              :value="tripType"
            >
              {{ tripType }}
            </a-select-option>
          </a-select>
        </a-col>

        <a-col :span="24" :md="12" class="d-flex align-center space-between">
          <div class="d-flex direction-column" style="width: 100%">
            <div style="font-size: 10px; line-height: 10px">даты</div>
            <a-range-picker
              v-model:value="time"
              :locale="ruLocale"
              :placeholder="['начало', 'конец']"
              inputmode="none"
            />
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

// .mdi-close {
//   position: absolute;
//   top: 4px;
//   right: 8px;
//   font-size: 20px;
//   padding: 4px;
//   cursor: pointer;
// }
// .mdi-close:active {
//   transform: scale(1.2);
// }
// .mdi-close:hover {
//   transform: scale(1.2);
// }
// .query-suggestions {
//   position: absolute;
//   z-index: 1;
//   top: 40px;
//   left: 4px;
//   width: 140%;
//   max-height: 400px;
//   overflow-y: scroll;
//   padding: 6px;

//   // overflow-x: hidden;
//   .card {
//     // background-color: #ff6600;
//     border-radius: 6px;
//     // border: 1px solid rgba(95, 95, 95, 0.3);
//     box-shadow: 0px 0px 6px 0px rgba(95, 95, 95, 0.2);
//     hr {
//       color: rgba(95, 95, 95, 0.01);
//     }
//   }

// }
.region-container {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  margin: 6px 0;
  user-select: none;
}
.region-container:hover {
  color: #ff6600;
}
.region-query:hover {
  color: #ff6600;
}
.region-query {
  cursor: pointer;
  width: fit-content;
}
@media (max-width: 767px) {
  .query-suggestions {
    top: 90px;
  }
}
.active_filter {
  color: #ff6600;
  cursor: pointer;
}

.filter {
  color: #227597;
  cursor: pointer;
}
.location-btn {
  text-transform: none;
  border-radius: 4px;
  line-height: 1;
  display: flex;
  align-items: center;
  .mdi {
    font-size: 20px;
  }
}
</style>
