<script setup>
import { ref, onMounted, watch, computed } from "vue";

import { useAppState } from "../../stores/appState";
import { usePlaces } from "../../stores/place";

const placeStore = usePlaces()
const appStore = useAppState();

const emit = defineEmits(['refreshPlaces'])



let isFilterShow = ref(false);

// dadata
let possibleLocations = ref([])
let locationSearchRequest = ref("")
function selectStartLocation(selected) {

  for (let l of possibleLocations.value) {
    // l.value - name
    if (l.value == selected) {
      placeStore.filter.locationRadius = 50
      placeStore.filter.location = l.location
    }
  }
}

function showFilter() {
  isFilterShow.value = true
}
function hideFilter() {
  isFilterShow.value = false
  emit('refreshPlaces');
}

function find() {
  emit('refreshPlaces');
}
function resetForm() {
  placeStore.filter.search = ''
  placeStore.filter.category = ''
  placeStore.filter.locationRadius = 0
  locationSearchRequest.value = ""
  placeStore.filter.location = { name: "", shortName: "", type: "Point", coordinates: [] }
  emit('refreshPlaces');
}


let placeCategory = appStore.appState[0]?.placeCategory.sort().map((name) => { return { value: name } }) ?? []
let filterString = computed(() => {
  let keyString = ''

  let placeFilter = placeStore.filter
  for (let key in placeFilter) { 
    if (key == 'location' && placeFilter[key] ) {
      keyString = keyString + ` ${placeFilter[key].shortName} ` 
      continue;
    }
    if (key == 'locationRadius' && placeFilter[key] ) {
      keyString = keyString + ` + ${placeFilter[key]}км. ` 
      continue;
    }
    if (placeFilter[key]) {
      keyString = keyString + `${placeFilter[key]}, ` 
    }
  }
  return keyString.trim().slice(0, -1)
})

let buttonTitle = computed(() => {
  return filterString.value ? filterString.value : "Что и где посетить?"
}
)
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
        if (s.data.settlement) {
          location.location.shortName = s.data.settlement
        }
        else if (s.data.city) {
          location.location.shortName = s.data.city
        } else {
          location.location.shortName = s.value
        }

        possibleLocations.value.push(location)
      }
    } catch (error) {
      console.log(error);
    }
  }
})

onMounted(async () => {
  await appStateStore.refreshState();

});
</script>

<template>

  <a-row class="d-flex justify-center">
    <a-col :xs="24" :lg="12" :md="16" class="pa-16">
      <div style="background: #239fca; padding: 10px; border-radius: 12px; display: flex; align-items: center">
        <div color="#239FCA" @click="showFilter" class="filter-button" type="button">
          {{ buttonTitle }}
        </div>

        <!-- Если будет что-то в фильтре показывать  -->
        <a-button type="primary" shape="circle" class="ml-8" v-if="filterString" @click="resetForm">
          <span class="mdi mdi-close"></span>
        </a-button>
      </div>
    </a-col>
  </a-row>

  <a-modal v-model:open="isFilterShow" title="Поиск места" :zIndex=900>



    <a-row :gutter="[8, 8]" class="d-flex justify-center flex-wrap">
      <a-col :span="24" class="d-flex direction-column">


        <a-input v-model:value="placeStore.filter.search" placeholder="название места" name="search"
          style="z-index: 0; width: 100%; margin-bottom: 6px" allowClear />

      </a-col>
      <a-col :span="24">
        <div>Адрес или координаты</div>

        <a-auto-complete v-model:value="locationSearchRequest" style="width: 100%" :options="possibleLocations"
          placeholder="Глазов" @select="selectStartLocation" allowClear>
        </a-auto-complete>
        <div v-if="locationSearchRequest">
          <a-slider v-model:value="placeStore.filter.locationRadius" :step="50" :min="50" :max="1000" tooltipPlacement="right"
            :tipFormatter="(s) => s + ' км'" />
          <b>Радиус поиска {{ placeStore.filter.locationRadius }} км.</b>
        </div>

      </a-col>

      <a-col :span="24">
        Тип места
        <a-select style="width: 100%" v-model:value="placeStore.filter.category" :options="placeCategory"
          placeholder="Музей, памятник" show-search allowClear>
        </a-select>
      </a-col>


    </a-row>





    <template #footer>
      <a-button key="submit" style="border-radius: 18px" type="primary"
        @click="hideFilter(), find()">Показать</a-button>
      <a-button key="back" style="border-radius: 18px" @click="resetForm(), hideFilter()">Очистить</a-button>
    </template>
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
</style>
