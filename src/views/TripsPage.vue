<script setup>
import { ref, onMounted } from "vue";
import TripFilter from "../components/sections/TripFilter.vue";
import TripsList from "../components/_tripsPage/TripsList.vue";
import BackButton from "../components/BackButton.vue";
import { useTrips } from "../stores/trips";
import { useRoute } from "vue-router";

const tripStore = useTrips();

const route = useRoute();
let trips = ref([]);

function findTrip(nameTrip) {
  let k = 0;
  let t = [];
  while (k < tripStore.trips.length) {
    if (
      tripStore.trips[k].name.toLowerCase().includes(nameTrip.toLowerCase())
    ) {
      t.push(tripStore.trips[k]);
    }
    k++;
  }
  trips.value = t;

  // const filterResult  = tripStore.trips.filter((trip) => {
  //   trip.name.toLowerCase().includes(nameTrip.toLowerCase())
  // });
}
onMounted(() => {
  if (route.query.search) {
    findTrip(route.query.search);
  } else {
    findTrip("");
  }
});
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>Туры</h2>
      </a-col>
    </a-row>
    <TripFilter @inputName="findTrip" :search="route.query.search" />
    <TripsList :trips="trips" />
  </div>
</template>
