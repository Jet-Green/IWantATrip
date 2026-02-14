<script setup>
import { ref, onMounted } from "vue";
import { useTrips } from "../../stores/trips";

import TripListCard from "../cards/TripListCard.vue";
import BackButton from "../BackButton.vue";
import TripFilter from "../sections/TripFilter.vue";
import { useRoute, useRouter } from "vue-router";


const route = useRoute();
const router = useRouter()
let tripStore = useTrips()
let isRefreshing = ref(false)




let handleScroll = async () => {

  let triggerHeight =
    wrapper.value.scrollTop + wrapper.value.offsetHeight + 5

  if (triggerHeight > wrapper.value.offsetHeight) {
    triggerHeight = wrapper.value.scrollHeight
  }

  if (triggerHeight == wrapper.value.scrollHeight) {
    await tripStore.fetchTrips()
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
    isRefreshing.value = true
    await tripStore.fetchTrips()
    isRefreshing.value = false
  }
});
</script>
<template>
  <div>
    <BackButton :backRoute="{ path: '/' }" />
    <div class="wrapper" ref="wrapper">
      <a-row type="flex" justify="center">
        <a-col :xs="22" :lg="16">
          <h2>Туры

          </h2>

        </a-col>

      </a-row>
      <TripFilter  />
      <a-row class="d-flex justify-center">
        <a-col :xs="22" :lg="16">
          <a-row :gutter="[16, 18]" class="d-flex justify-center mt-8 pb-24" v-if="tripStore.trips.length">
            <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="trip in tripStore.trips" :key="trip.index">
              <TripListCard :trip="trip" />
            </a-col>
          </a-row>
          <a-row v-if="isRefreshing">
            <a-col :span="24" class="d-flex justify-center">
              <img src="../../assets/images/founddog.webp" alt="not found" style="height: 150px;">
            </a-col>
          </a-row>
          <a-row v-if="!tripStore.trips.length && !tripStore.isFetching">
            <a-col :span="24" class="d-flex justify-center align-center">
              <div style="display: flex; flex-direction: column;">
                <h3 style="text-align: center;">я ничего не нашёл</h3>
                <div class="d-flex justify-center">

                  <img src="../../assets/images/notfound.jpg" alt="not found" style="height: 150px;">
                </div>

                <h3 style="text-align: center;">Закажите из каталога туров <br>
                  на удобную вам дату
                </h3>
    
                <a-button type="primary"  @click="
                  router.push({ name: 'CatalogPage', query: { search: tripStore.tripFilter.query } })
                  " class="lets_go_btn">В каталог</a-button>
              </div>
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
