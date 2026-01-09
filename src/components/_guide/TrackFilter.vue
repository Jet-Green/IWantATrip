<script setup>
import { ref, onMounted, watch, computed } from "vue";

import { useTracks } from "../../stores/track";
import { useLocations } from "../../stores/locations";

const trackStore = useTracks()
const locationsStore = useLocations()

const emit = defineEmits(['refreshTracks'])

let isFilterShow = ref(false);
// dadata
let possibleLocations = ref([])
let locationSearchRequest = ref("")
const trackTypes = [
  { value: 'пешком' },
  { value: 'на велосипеде' },
  { value: 'на автомобиле' },
]

function selectLocation(selected) {
  for (let l of possibleLocations.value) {
    if (l.value == selected) {
      trackStore.filter.locationRadius = 50
      trackStore.filter.location = l.location
    }
  }
}

function showFilter() { isFilterShow.value = true }
function hideFilter() { isFilterShow.value = false; emit('refreshTracks') }

function find() { emit('refreshTracks') }
function resetForm() {
  trackStore.filter.search = ''
  trackStore.filter.locationRadius = 0
  locationSearchRequest.value = ""
  trackStore.filter.location = { name: "", shortName: "", type: "Point", coordinates: [] }
  trackStore.filter.type = ''
  emit('refreshTracks')
}

let filterString = computed(() => {
  let keyString = ''
  let f = trackStore.filter
  if (f.location?.shortName) { keyString = keyString + ` ${f.location.shortName} ` }
  if (f.locationRadius) { keyString = keyString + ` + ${f.locationRadius}км. ` }
  if (f.search) { keyString = keyString + `${f.search}, ` }
  if (f.type) { keyString = keyString + `${f.type}, ` }
  return keyString.trim().replace(/,\s*$/, '')
})

let buttonTitle = computed(() => {
  return filterString.value ? filterString.value : "Какие маршруты и где?"
})

watch(locationSearchRequest, async (newValue, oldValue) => {
  if (newValue.trim().length > 2 && newValue.length > oldValue.length) {
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

    var options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + import.meta.env.VITE_DADATA_TOKEN
      },
      body: JSON.stringify({
        query: newValue,
        count: 5,
        "from_bound": { "value": "city" },
        "to_bound": { "value": "settlement" }
      })
    }

    let res = await fetch(url, options)
    try {
      let suggestions = JSON.parse(await res.text()).suggestions
      possibleLocations.value = []
      for (let s of suggestions) {
        let location = {
          value: s.value,
          location: {
            name: s.value,
            shortName: '',
            type: 'Point',
            coordinates: [
              Number(s.data.geo_lon),
              Number(s.data.geo_lat)
            ]
          }
        }
        if (s.data.settlement) location.location.shortName = s.data.settlement
        else if (s.data.city) location.location.shortName = s.data.city
        else location.location.shortName = s.value

        possibleLocations.value.push(location)
      }
    } catch (error) {
      console.log(error);
    }
  }
})

if (locationsStore?.location?.name) {
  trackStore.filter.location.name = locationsStore.location.name
  trackStore.filter.location.shortName = locationsStore.location.shortName
  trackStore.filter.location.type = locationsStore.location.type
  trackStore.filter.location.coordinates = locationsStore.location.coordinates
  locationSearchRequest.value = locationsStore.location.name
  trackStore.filter.locationRadius = 50
}

find()
onMounted(async () => {
  // no appState dependency for tracks filter for now
});
</script>

<template>
  <a-row class="d-flex justify-center">
    <a-col :xs="24" :lg="12" :md="16" class="pa-16">
      <div style="background: #239fca; padding: 10px; border-radius: 12px; display: flex; align-items: center">
        <div color="#239FCA" @click="showFilter" class="filter-button" type="button">
          {{ buttonTitle }}
        </div>
        <a-button type="primary" shape="circle" class="ml-8" v-if="filterString" @click="resetForm">
          <span class="mdi mdi-close"></span>
        </a-button>
      </div>
    </a-col>
  </a-row>

  <a-modal v-model:open="isFilterShow" title="Поиск маршрута" :zIndex="900">
    <a-row :gutter="[8, 8]" class="d-flex justify-center flex-wrap">
      <a-col :span="24" class="d-flex direction-column">
        <a-input v-model:value="trackStore.filter.search" placeholder="название маршрута" name="search"
          style="z-index: 0; width: 100%; margin-bottom: 6px" allowClear />
      </a-col>
      <a-col :span="24">
        <div>Адрес или координаты</div>
        <a-auto-complete v-model:value="locationSearchRequest" style="width: 100%" :options="possibleLocations"
          placeholder="Глазов" @select="selectLocation" allowClear>
        </a-auto-complete>
        <div v-if="locationSearchRequest">
          <a-slider v-model:value="trackStore.filter.locationRadius" :step="50" :min="0" :max="1000"
            tooltipPlacement="right" :tipFormatter="(s) => s + ' км'" />
          <b>Радиус поиска {{ trackStore.filter.locationRadius }} км.</b>
        </div>
      </a-col>

      <a-col :span="24">
        Тип маршрута
        <a-select style="width: 100%" v-model:value="trackStore.filter.type" :options="trackTypes"
          placeholder="пешком, на велосипеде" show-search allowClear>
        </a-select>
      </a-col>
    </a-row>
    <template #footer>
      <a-button key="submit" style="border-radius: 18px" type="primary" @click="hideFilter(), find()">Показать</a-button>
      <a-button key="back" style="border-radius: 18px" @click="resetForm(), hideFilter()">Очистить</a-button>
    </template>
  </a-modal>
</template>

<style lang="scss" scoped>
.active_filter { color: #ff6600; cursor: pointer; }
.filter { color: #227597; cursor: pointer; }
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
</style>
