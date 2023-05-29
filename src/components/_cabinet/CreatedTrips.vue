<script setup>
import { ref, onMounted, computed } from "vue";
import CabinetTrip from "../cards/CabinetTrip.vue";
import TripService from "../../service/TripService";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useAuth } from "../../stores/auth.js";
import { useTrips } from "../../stores/trips.js";

let userStore = useAuth();
let router = useRouter();

let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");

let tripStore = useTrips();
let trips = ref([]);
let tripsOnModeration = ref([])
let archiveTrips = ref([])

let tripsIds = computed(() => userStore.user.trips);

function getPhoneNumber(number) {
  return `tel:${number}`
}

onMounted(async () => {
  let userId = userStore.user._id
  let response = await tripStore.getCreatedTripsInfoByUserId(userId)
  let created = response.data

  for (let trip of created) {
    // { start: { $gt: Date.now() } }
    if (trip.start < Date.now()) {
      archiveTrips.value.push(trips)
      continue
    }
    if (trip.isModerated) {
      trips.value.push(trip);
    } else {
      tripsOnModeration.value.push(trip)
    }
  }
});
let activeKey = ref(2)
</script>
<template>
  <a-row>
    <a-col :span="24">
      <a-collapse v-model:activeKey="activeKey" ghost>
        <a-collapse-panel v-if="tripsOnModeration.length" key="1" header="На модерации">
          <a-row :gutter="[8, 8]" class="mt-8" v-if="tripsOnModeration.length > 0">
            <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of tripsOnModeration" :key="index">
              <CabinetTrip :trip="trip" :actions="['delete', 'info', 'edit', 'msg']" />
            </a-col>
          </a-row>
        </a-collapse-panel>


        <a-collapse-panel key="2" header="Действующие туры">
          <a-row :gutter="[8, 8]" class="mt-8" v-if="trips.length > 0">
            <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of trips" :key="index">
              <CabinetTrip :trip="trip" :actions="['delete', 'info', 'copy', 'hide', 'edit']" />
            </a-col>
          </a-row>
          <a-row :lg="8" :sm="12" :xs="24" v-else>
            Нет туров
          </a-row>
        </a-collapse-panel>


        <a-collapse-panel key="3" header="Архивные туры">
          <a-row :gutter="[8, 8]" class="mt-8" v-if="archiveTrips.length > 0">
            <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of archiveTrips" :key="index">
              <CabinetTrip :trip="trip" :actions="['delete', 'info', 'copy', 'edit']" />
            </a-col>
          </a-row>
          <a-row :lg="8" :sm="12" :xs="24" v-else>
            Нет туров
          </a-row>
        </a-collapse-panel>
      </a-collapse>
    </a-col>
  </a-row>
</template>
