<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useTrips } from "../../stores/trips";


import TripCard from "../cards/TripCard.vue";

const useTripsStore = useTrips();

let tripStore = useTrips()


const trips = computed(() => {
  return useTripsStore.trips;
});


onMounted(async () => {
  if (!tripStore.trips?.length)
    await tripStore.fetchTrips()
});
</script>
<template>
  <a-row type="flex" justify="center" class="find_trip_bg ">
    <a-col :xs="24">
      <a-row type="flex" justify="center" style="flex-direction: row">
        <!-- <a-col>
          <h2 style="color: white">Выбери готовый тур</h2>
        </a-col> -->
      </a-row>
      <a-row v-if="trips.length">
        <a-col :span="24">
          <div class="section">
            <div v-for="trip in trips" :key="trip.index" class="ma-8 section__item">
              <TripCard :trip="trip" :isPreview="true" />
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row v-else>
        <a-col :span="24" class="d-flex justify-center align-center">
          <a-spin size="large"></a-spin>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<style scoped>
.find_trip_bg {
  min-height: 282px;
  background: linear-gradient(#64bed8, #34313e);
}

.carousel__slide {
  align-items: end;
}

.section {
  display: flex;
  align-items: end;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 0 1rem 1rem 1rem;
  gap: 1rem;
}

.section__item {
  scroll-snap-align: center;
  scroll-snap-stop: always;

}
</style>
