<script setup>
import { ref, onMounted, watch, computed, } from "vue";
import CabinetTrip from "../cards/CabinetTrip.vue";
import { useAuth } from "../../stores/auth.js";
import { useTrips } from "../../stores/trips.js";
import { useRouter } from "vue-router";

let userStore = useAuth();
let tripStore = useTrips();
let router = useRouter();

let allTrips = ref([])
let tripsStatus = ref('')
let loading = ref(true)
let query = ref('')

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
watch(tripsStatus, (status) => {
  localStorage.setItem("createdTripsStatus", status)
  if (status === 'tripsInWork') {
    return router.push('/cabinet/created-trips/created-active-trips')
  }
  if (status === 'tripsOnModeration') {
    return router.push('/cabinet/created-trips/created-trip-on-moderation')
  }
  if (status === 'archiveTrips') {
    return router.push('/cabinet/created-trips/created-archived-trips')
  }
});
onMounted(async () => {
  tripsStatus.value = localStorage.getItem("createdTripsStatus") ? localStorage.getItem("createdTripsStatus") : 'tripsInWork'
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

      <router-view />

    </div>
  </a-row>
</template>
