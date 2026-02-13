<script setup>
import { ref, onMounted, watch, computed } from "vue"
import { useRouter } from "vue-router"
import { useTrips } from "../../stores/trips.js"
import { useAppState } from "../../stores/appState"
import { useLocations } from "../../stores/locations.js"
import { storeToRefs } from "pinia"

import dayjs from "dayjs"
import locale from "ant-design-vue/es/date-picker/locale/ru_RU"
import "dayjs/locale/ru"
dayjs.locale("ru")

const ruLocale = locale

const router = useRouter()
let props = defineProps({
  search: String,
})

const tripStore = useTrips()
const appStore = useAppState()
const locationStore = useLocations()

let { selectLocationDialog } = storeToRefs(locationStore)
let { trips } = storeToRefs(tripStore)

let time = ref([])
let query = ref("")
let tripRegion = ref("")
let type = ref("")
let locationRadius = ref(0)
// названия туров в диалоговом окне
let foundTrips = ref([])

let querySuggestionsVisible = ref(false)

let suggestedRegions = computed(() => {
  if (tripRegion.value.trim().length <= 2) return []
  return (
    appStore.appState[0].tripRegions?.filter((reg) =>
      reg.toLowerCase().includes(tripRegion.value.trim().toLocaleLowerCase())
    ) ?? []
  )
})

let buttonTitle = computed(() => {
  if (
    !tripRegion.value &&
    (!locationStore.location?._id) &&
    !type.value &&
    time.value?.length == 0
  ) {
    return "Куда, откуда, когда?"
  }

  let result = []
  if (tripRegion.value) {
    result.push(tripRegion.value)
  }
  if (locationStore.location?._id) {
    result.push(`${locationStore.location.shortName} + ${locationRadius.value} км.`)
  }
  if (type.value.length > 0) result.push(type.value)
  if (time.value?.length > 0) {
    let start = new Date(time.value[0].$d).toLocaleDateString("RU-ru", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    let end = new Date(time.value[1].$d).toLocaleDateString("RU-ru", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    result.push(`c ${start} по ${end}`)
  }

  return result.join(", ").length > 0 ? result.join(", ") : "Куда, откуда, когда?"
})

watch(time, (newTime) => {
  if (!newTime) {
    localStorage.setItem("TripTimeStart", "")
    localStorage.setItem("TripTimeEnd", "")
  } else if (newTime[0] && newTime[1]) {
    let start = new Date(newTime[0].$d)
    let end = new Date(newTime[1].$d)

    localStorage.setItem("TripTimeStart", start)
    localStorage.setItem("TripTimeEnd", end)
  } else {
    localStorage.setItem("TripTimeStart", "")
    localStorage.setItem("TripTimeEnd", "")
  }
})

function hideQuerySuggestions() {
  querySuggestionsVisible.value = false
}

function showQuerySuggestions() {
  querySuggestionsVisible.value = true
}

let regionSelected = ref(false)
function selectRegion(regionName) {
  tripRegion.value = regionName
  query.value = regionName
  regionSelected.value = true
  querySuggestionsVisible.value = false
}

function setStartEndTimeToState() {
  let start = new Date(time.value[0].$d)
  let end = new Date(time.value[1].$d)

  start.setHours(0)
  start.setMinutes(0)
  start.setSeconds(0)
  start.setMilliseconds(0)

  end.setHours(23)
  end.setMinutes(59)
  end.setSeconds(59)
  end.setMilliseconds(999)

  // перед тем, как мы запишем в start и end Number, нужно сохранить в localStorage
  localStorage.setItem("TripTimeStart", start)
  localStorage.setItem("TripTimeEnd", end)

  start = Number(Date.parse(start.toString()))
  end = Number(Date.parse(end.toString()))

  tripStore.tripFilter.start = start
  tripStore.tripFilter.end = end
}

async function find() {
  // query - для поиска по названиям
  // tripRegion для поиска по регионам
  // используются параллельно, независимо от того, выбрал ли
  // пользователь конкретный регион или нет
  query.value = tripRegion.value

  localStorage.setItem("TripQuery", query.value)
  localStorage.setItem("TripType", type.value)
  tripStore.searchCursor = 1
  tripStore.cursor = 1
  tripStore.trips = []

  tripStore.tripFilter.tripRegion = tripRegion.value
  tripStore.tripFilter.locationRadius = locationRadius.value
  // очищаешь фильтры и time.value = null
  // порядок в этом выражении важен, так как второе выражение
  // не будет выполняться, если первое не выполнилось и не будет возникать ошибки
  if (time.value != null && (time.value[0] || time.value[1])) {
    tripStore.tripFilter.query = query.value

    tripStore.tripFilter.type = type.value

    setStartEndTimeToState()
    await tripStore.fetchTrips()
  } else {
    tripStore.tripFilter.query = query.value
    tripStore.tripFilter.start = ""
    tripStore.tripFilter.end = ""
    tripStore.tripFilter.type = type.value
    await tripStore.fetchTrips()
  }
}

function resetForm() {
  tripStore.tripFilter.query = ""
  tripStore.tripFilter.start = ""
  tripStore.tripFilter.end = ""
  tripStore.tripFilter.type = ""
  tripStore.tripFilter.tripRegion = ""
  tripStore.tripFilter.locationRadius = 0

  type.value = ""
  time.value = []
  query.value = ""
  tripRegion.value = ""
  locationRadius.value = 0

  localStorage.setItem("TripTimeStart", "")
  localStorage.setItem("TripTimeEnd", "")
  localStorage.setItem("TripQuery", "")
  localStorage.setItem("TripType", "")
  localStorage.setItem("LocationRadius", "100")

  find()
}

watch(locationRadius, (newRadius) => {

    localStorage.setItem("LocationRadius", newRadius)

})

watch(tripRegion, async (newRegion) => {
  localStorage.setItem("TripRegion", newRegion)

  if (newRegion.trim().length > 2) {
    await find()
  }
  // когда ничего не введено - не показывать туры
  if (newRegion.trim().length == 0) foundTrips.value = []
})

watch(trips, (newTrips) => {
  foundTrips.value = newTrips.map((trip) => {
    return {
      name: trip.name,
      _id: trip._id,
    }
  })
})
watch(locationRadius, () => {
  find()
})

onMounted(() => {
  query.value = localStorage.getItem("TripQuery") ?? ""
  type.value = localStorage.getItem("TripType") ?? ""
  tripStore.tripFilter.type = type.value

  tripStore.tripFilter.query = query.value

  if (localStorage.getItem("TripTimeStart")) {
    time.value[0] = dayjs(localStorage.getItem("TripTimeStart"))
    time.value[1] = dayjs(localStorage.getItem("TripTimeEnd"))

    setStartEndTimeToState()
  }
  if (localStorage.getItem("LocationRadius")) {
    locationRadius.value = Number(localStorage.getItem("LocationRadius"))
    // нужно, чтобы и в pinia обновлялась эта информация
    tripStore.tripFilter.locationRadius = locationRadius.value
  }
  if (localStorage.getItem("TripRegion")) {
    tripRegion.value = localStorage.getItem("TripRegion")
    tripStore.tripFilter.tripRegion = tripRegion.value
  }

  if (props.search) {
    query.value = props.search
    tripStore.tripFilter.query = query.value
    tripRegion.value = query.value
  }
  if (query.value || type.value) {
    find()
  }
})
</script>

<template>
  <!-- <MdiIcon :class="{ active_filter: visible, filter: !visible }"
    @click="visible = !visible" name="filter-outline" size="24px" class="ml-16" /> -->

  <a-row type="flex" justify="center" class="section_bg">
    <a-col :xs="22" :lg="16">
      <a-row class="d-flex justify-center">
        <a-col :xs="24" :lg="12" :md="16" class="pa-16">
          <div style="background: #239fca; padding: 10px; border-radius: 12px; display: flex; align-items: center">
            <div color="#239FCA" @click="showQuerySuggestions()" class="filter-button" type="button">
              {{ buttonTitle }}
            </div>

            <!-- Если будет что-то в фильтре показывать  -->
            <a-button type="primary" shape="circle" class="ml-8" @click="resetForm"
              v-if="tripRegion || Number(locationRadius) || type.length > 0 || time?.length > 0">
              <MdiIcon name="close" />
            </a-button>
          </div>
        </a-col>
      </a-row>

      <!-- Всплывающее окно с фильтрами -->
      <a-modal v-model:open="querySuggestionsVisible" title="Поиск тура" :zIndex=900>
        <a-row :gutter="[16, 16]">
          <a-col :span="24">
            <!-- <div class="subtitle">Куда</div> -->
            <a-input v-model:value="tripRegion" placeholder="Название, направление? " name="search" style="width: 100%" allowClear
              autocomplete="off" autofocus size="large" />
          </a-col>

          <!-- если есть локация, то можно показывать радиус -->
          <a-col :span="24" class="subtitle">Откуда: место начала</a-col>
          <a-col :span="24" v-if="locationStore.location?._id">
            <div class="start-location-container" @click="selectLocationDialog = !selectLocationDialog">
              <MdiIcon name="map-marker-radius-outline" />
              {{ locationStore.location.shortName }}
            </div>
            <div>
              <a-slider v-model:value="locationRadius" :step="100" :min="0" :max="1800" tooltipPlacement="right"
                :tipFormatter="(s) => s + ' км'" />
              <b>Радиус поиска {{ locationRadius }} км.</b>
            </div>
          </a-col>
          <!-- если нет локации - выбираем её, потом радиус и появится -->
          <a-col v-else :span="24">
            <div class="no-location" @click="selectLocationDialog = !selectLocationDialog">
              <MdiIcon name="map-marker-outline" />
              <span> Ваш город </span>    
            </div>
            <div> начало из любого города </div>
          </a-col>
          <a-col :span="24">
            <a-collapse :bordered="false">
              <a-collapse-panel key="1" header="доп. фильтры" :style="'padding: 0px;'">
                <a-row :gutter="[0, 16]">
                  <a-col :span="24" class="d-flex direction-column" v-if="appStore.appState">
                    <div style="font-size: 13px; line-height: 13px">вид тура</div>
                    <a-select v-model:value="type">
                      <a-select-option value=""></a-select-option>
                      <a-select-option placeholder="Tип тура" v-for="tripType in appStore.appState[0]?.tripType"
                        :value="tripType">
                        {{ tripType }}
                      </a-select-option>
                    </a-select>
                  </a-col>

                  <a-col :span="24" class="d-flex align-center space-between">
                    <div class="d-flex direction-column" style="width: 100%">
                      <div style="font-size: 13px; line-height: 13px">даты</div>
                      <a-range-picker v-model:value="time" :locale="ruLocale" :placeholder="['начало', 'конец']"
                        inputmode="none" />
                    </div>
                  </a-col>
                </a-row>
              </a-collapse-panel>
            </a-collapse>
          </a-col>
          <a-col :span="24" v-if="suggestedRegions.length > 0">
            <div class="subtitle">Направления</div>
            <div class="suggestions-container">
              <div  v-for="region of suggestedRegions">
                <div class="region-container" @click="selectRegion(region)">
                  <div>
                    {{ region }}
                  </div>
                  <div>
                    <MdiIcon name="check" />
                  </div>
                </div>
              </div>
            </div>
          </a-col>
          <a-divider></a-divider>
          <a-col :span="24" class="trips-container">
            <div class="subtitle">Туры</div>
            <div v-if="foundTrips.length" v-for="fTrip of foundTrips" class="mb-8">
              <span class="trip-name" @click="router.push(`/trip?_id=${fTrip._id}`)">
               - {{ fTrip.name }}
              </span>
            </div>
            <div  v-else>Ничего не нашлось</div>
          </a-col>
        </a-row>

        <template #footer>
          <a-button key="submit" style="border-radius: 18px" type="primary"
            @click="hideQuerySuggestions(), find()">Показать</a-button>
          <a-button key="back" style="border-radius: 18px" @click="resetForm">Очистить</a-button>
        </template>
      </a-modal>
      <!-- Всплывающее окно с фильтрами -->
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
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

.start-location-container {
  font-weight: bold;
  font-size: clamp(0.875rem, 0.7756rem + 0.2841vw, 1rem);
  // чтобы div не растягивался на весь контейнер
  width: fit-content;
  cursor: pointer;
}

.no-location {
  cursor: pointer;
  font-weight: bold;
  font-size: clamp(0.875rem, 0.7756rem + 0.2841vw, 1rem);
}

.trip-name {

  cursor: pointer;
  font-size: clamp(0.875rem, 0.7756rem + 0.2841vw, 1rem);
  line-height: 1.3;
}

.trips-container {
  max-height: 150px;
  overflow-y: scroll;
}

.suggestions-container {
  max-height: 150px;
  overflow-y: scroll;
}

.subtitle {
  font-size: 13px;
  line-height: 13px;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: center;
}
</style>
