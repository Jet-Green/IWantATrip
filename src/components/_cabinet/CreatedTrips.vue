<script setup>
import { ref, onMounted, watch, computed, } from "vue";
import CabinetTrip from "../cards/CabinetTrip.vue";
import { useAuth } from "../../stores/auth.js";
import { useTrips } from "../../stores/trips.js";

let userStore = useAuth();
let tripStore = useTrips();



let allTrips = ref([])
let tripsStatus = ref('tripsInWork')
let loading = ref(true)
let query = ref('')


async function deleteTrip() {
  await getAllTrips()
}


let getTripsArrayByStatus = computed(() => {
  let result = {
    archiveTrips: [],
    tripsInWork: [],
    tripsOnModeration: [],
  }
  for (let trip of filteredTrips.value) {
    if (trip.start < Date.now()) {
      result.archiveTrips.push(trip)
      continue
    }
    if (trip.isModerated) {
      result.tripsInWork.push(trip);
    } else {
      result.tripsOnModeration.push(trip)
    }
  }
  return result
})

let filteredTrips = computed(() => {

  if (query.value.length > 2) {
    localStorage.setItem("cabinetQuery", query.value);
    return allTrips.value.filter((trip) => trip.name.toLowerCase().includes(query.value.toLowerCase())
      || trip.description.toLowerCase().includes(query.value.toLowerCase())
      || trip.tripRoute.toLowerCase().includes(query.value.toLowerCase())
      || trip.tripType.toLowerCase().includes(query.value.toLowerCase())
      || trip.startLocation.name.toLowerCase().includes(query.value.toLowerCase())
      || (trip.partner ? trip.partner.toLowerCase().includes(query.value.toLowerCase()) : false)
      || trip.offer.toLowerCase().includes(query.value.toLowerCase())
    )
  } else {
    localStorage.setItem("cabinetQuery", '');
    return allTrips.value
  }

})

async function getAllTrips() {
  loading.value = true
  let userId = userStore.user._id
  let response = await tripStore.getCreatedTripsInfoByUserId(userId)

  allTrips.value = response.data
  loading.value = false
}

// watch(query, () => {
//   query.value.length <= 3 ? localStorage.setItem("cabinetQuery", '') : null
// })
onMounted(async () => {
  query.value = localStorage.getItem("cabinetQuery") ?? '';
  await getAllTrips()
});

</script>
<template>
  <a-row>
    <div class="d-flex space-between align-center flex-wrap" style="width: 100%">

      <a-radio-group v-model:value="tripsStatus">
        <a-radio value="tripsOnModeration">На модерации</a-radio>
        <a-radio value="tripsInWork">Действующие</a-radio>
        <a-radio value="archiveTrips">Архив</a-radio>
      </a-radio-group>


      <div>
        <a-input v-model:value="query" placeholder="поиск" />
      </div>

    </div>
    <a-col :span="24" v-if="loading" class="d-flex justify-center">
      <a-spin size="large" />
    </a-col>

    <a-col :span="24" v-else>
      <div v-if="tripsStatus == 'tripsOnModeration'">
        <a-row :gutter="[8, 8]" class="mt-8" v-if="getTripsArrayByStatus.tripsOnModeration.length > 0">
          <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of getTripsArrayByStatus.tripsOnModeration" :key="index">
            <CabinetTrip :trip="trip" :actions="['delete', 'info', 'edit', 'msg']" @deleteTrip="deleteTrip"
              @updateTrip="getAllTrips" />
          </a-col>
        </a-row>
        <a-row :lg="8" :sm="12" :xs="24" v-else>
          Нет туров
        </a-row>
      </div>


      <div v-if="tripsStatus == 'tripsInWork'">
        <a-row :gutter="[8, 8]" class="mt-8" v-if="getTripsArrayByStatus.tripsInWork.length > 0">
          <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of getTripsArrayByStatus.tripsInWork" :key="index">

            <CabinetTrip :trip="trip" :actions="['delete', 'info', 'copy', 'hide', 'edit', 'addDate', 'addLocation']"
              @deleteTrip="deleteTrip" @updateTrip="getAllTrips" />
          </a-col>
        </a-row>
        <a-row :lg="8" :sm="12" :xs="24" v-else>
          Нет туров
        </a-row>
      </div>


      <div v-if="tripsStatus == 'archiveTrips'">
        <a-row :gutter="[8, 8]" class="mt-8" v-if="getTripsArrayByStatus.archiveTrips.length > 0">
          <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of getTripsArrayByStatus.archiveTrips" :key="index">
            <CabinetTrip :trip="trip" :actions="['delete', 'info', 'copy', 'edit', 'addDate']" @deleteTrip="deleteTrip"
              @updateTrip="getAllTrips" />
          </a-col>
        </a-row>
        <a-row :lg="8" :sm="12" :xs="24" v-else>
          Нет туров
        </a-row>
      </div>

    </a-col>
  </a-row>
</template>
