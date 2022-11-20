<script setup>
import { ref, onMounted, computed } from "vue"
import axios from "axios"
import TripService from "../../service/TripService";

import { useRouter } from "vue-router"
import { useAuth } from "../../stores/auth.js";

let userStore = useAuth()
let router = useRouter()

let trips = ref([])
let tripsIds = computed(() => userStore.user.trips)

function goToTripPage(_id) {
  router.push(`/trip?_id=${_id}`);
}
async function tripToDelete(_id) {
  alert('не работает')
  // await TripService.deleteTrip({ _id: _id });
}
function editTrip(_id) {
  alert('не работает')
}
async function hideTrip(_id) {
  for (let t of trips.value) {
    if (t._id == _id) {
      t.isHidden = !t.isHidden
      TripService.hideTrip(_id, t.isHidden)
    }
  }
}

onMounted(() => {
  for (let _id of tripsIds.value) {
    axios
      .get(`${import.meta.env.VITE_API_URL}/trips/get-by-id?_id=${_id}`)
      .then((response) => {
        trips.value.push(response.data)
      })
  }
})
</script>
<template>
  <a-row>
    <a-col :span="12" v-for="trip of trips">
      <div @click="goToTripPage(trip._id)" class="card" style="max-width: 300px;">
        <div class="title">{{ trip.name }}</div>
        <a-badge-ribbon :text="`${trip.cost.length ? trip.cost[0].price : 0} руб`" color="ff6600">
          <div>
            <div class="overlay" v-if="trip.isHidden"></div>
            <div>
              <img :src="trip.images[0]" style="object-fit: cover; width: 100%; height: 175px" />
            </div>
            <p style="text-align: center">
              <!-- c <strong>{{ clearData(trip.start) }}</strong> по
            <strong>{{ clearData(trip.end) }}</strong> -->
            </p>
          </div>
        </a-badge-ribbon>
      </div>
      <div class="actions">
        <span class="mdi mdi-delete" style="color: red; cursor: pointer;" @click="tripToDelete(trip._id)"></span>
        <span class="mdi mdi-pen" style="color: #245159; cursor: pointer;" @click="editTrip(trip._id)"></span>
        <span v-if="!trip.isHidden" class="mdi mdi-eye-off" style="color: #245159; cursor: pointer;"
          @click="hideTrip(trip._id)"></span>
        <span v-else class="mdi mdi-eye" style="color: #245159; cursor: pointer;" @click="hideTrip(trip._id)"></span>
      </div>
    </a-col>
  </a-row>
</template>
<style scoped lang="scss">
.custom-card {
  margin: 8px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  .cover {
    object-fit: contain;
    display: flex;
    justify-content: center;
    background-color: #c4c4c4;
  }
}

.actions {
  font-size: 20px;
  position: relative;

  * {
    margin: 8px;
  }
}

.title {
  font-size: 16px;
  text-transform: uppercase;
  text-align: center;
}

.card {
  position: relative;
}

.overlay {
  position: absolute;
  background: rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 100%;
}
</style>