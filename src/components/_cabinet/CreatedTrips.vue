<script setup>
import { ref, onMounted, computed } from "vue"
import TripService from "../../service/TripService";

import { useRouter } from "vue-router"
import { useAuth } from "../../stores/auth.js";
import { useTrips } from "../../stores/trips.js";


let userStore = useAuth()
let router = useRouter()

let tripStore = useTrips()
let trips = ref([])
let tripsIds = computed(() => userStore.user.trips)

function goToTripPage(_id) {
  router.push(`/trip?_id=${_id}`);
}
async function tripToDelete(_id) {
  for (let i = 0; i < trips.value.length; i++) {
    if (trips.value[i]._id == _id) {
      trips.value.splice(i, 1)
    }
  }
  await tripStore.deleteById(_id)
}
function editTrip(_id) {
  router.push(`/edit-trip?_id=${_id}`);
}
async function hideTrip(_id) {
  for (let t of trips.value) {
    if (t._id == _id) {
      t.isHidden = !t.isHidden
      TripService.hideTrip(_id, t.isHidden)
    }
  }
}

onMounted(async () => {
  for (let _id of tripsIds.value) {
    let res = await tripStore.getById(_id)
    if (res.data) {
      trips.value.push(res.data)
    }
  }
})
</script>
<template>
  <a-row>
    <a-col :span="12" v-for="trip of trips">
      <div @click="goToTripPage(trip._id)" class="custom-card" style="max-width: 300px;">
        <div class="title">{{ trip.name }}</div>
        <a-badge-ribbon :text="`${trip.cost.length ? trip.cost[0].price : 0} руб`" color="ff6600">
          <div>
            <div class="overlay" v-if="trip.isHidden"></div>
            <div>
              <img :src="trip.images[0]" class="cover" />
            </div>
            <p style="text-align: center">
              <!-- c <strong>{{ clearData(trip.start) }}</strong> по
            <strong>{{ clearData(trip.end) }}</strong> -->
            </p>
          </div>
        </a-badge-ribbon>
      </div>
      <div class="actions">
        <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="tripToDelete(trip._id)">
          <span class="mdi mdi-delete" style="color: red; cursor: pointer;"></span>
        </a-popconfirm>
        <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="editTrip(trip._id)">
          <span class="mdi mdi-pen" style="color: #245159; cursor: pointer;"></span>
        </a-popconfirm>
        <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="hideTrip(trip._id)">
          <span v-if="!trip.isHidden" class="mdi mdi-eye" style="color: #245159; cursor: pointer;"></span>
          <span v-else class="mdi mdi-eye-off" style="color: #245159; cursor: pointer;"></span>
        </a-popconfirm>
      </div>
    </a-col>
  </a-row>
</template>
<style scoped lang="scss">
.custom-card {
  position: relative;
  margin: 8px;
  background: #ffffff;
  // box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  // border-radius: 10px;
  cursor: pointer;

  .cover {
    object-fit: cover;
    width: 100%;
    height: 175px;
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

.overlay {
  position: absolute;
  background: rgba(190, 190, 190, 0.7);
  width: 100%;
  height: 100%;
}
</style>