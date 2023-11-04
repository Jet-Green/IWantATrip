<script setup>
import { ref, onMounted } from "vue";
import { useTrips } from "../../stores/trips";
import TripListCard from "../cards/TripListCard.vue";
import BackButton from "../BackButton.vue";
import TripFilter from "../sections/TripFilter.vue";
import { useRoute } from "vue-router";

const route = useRoute();
let tripStore = useTrips()
let isRefreshing = ref(true)

let handleScroll = async () => {
  isRefreshing.value = true
  let triggerHeight =
    wrapper.value.scrollTop + wrapper.value.offsetHeight
  if (triggerHeight == wrapper.value.scrollHeight) {
    await tripStore.fetchTrips(
      tripStore?.tripFilter.query,
      tripStore?.tripFilter.start,
      tripStore?.tripFilter.end,
      tripStore?.tripFilter.type)
    isRefreshing.value = false
  }

}

const wrapper = ref(null)

onMounted(async () => {

  if (route.hash) {
    let id = route.hash.slice(1)
    document.getElementById(id)?.scrollIntoView()
  }
  wrapper.value.addEventListener("scroll", handleScroll);
  if (tripStore.trips.length == 0) {
    await tripStore.fetchTrips()
    isRefreshing.value = false
  }
});
</script>
<template>
  <div>
    <BackButton />
    <div class="wrapper" ref="wrapper">
      <a-row type="flex" justify="center">
        <a-col :xs="22" :lg="16">
          <h2>Туры</h2>
        </a-col>
      </a-row>
      <TripFilter :search="route.query.search" />
      <a-row class="d-flex justify-center">
        <a-col :xs="22" :lg="16">
          <a-row :gutter="[16, 18]" class="d-flex justify-center mt-8 pb-24" v-if="tripStore.trips.length">
            <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="trip in tripStore.trips" :key="trip.index">
              <TripListCard :trip="trip" />
            </a-col>
          </a-row>
          <a-row v-else-if="isRefreshing">
            <a-col :span="24" class="d-flex justify-center">
              <a-spin tip="Загрузка">
              </a-spin>
            </a-col>
          </a-row>
          <a-row v-else>
            <a-col :span="24" class="d-flex justify-center">
              нет туров
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {

  height: 85vh;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
