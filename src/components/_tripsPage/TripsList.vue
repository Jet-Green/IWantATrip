<script setup>
import { ref, onMounted } from "vue";
import { useTrips } from "../../stores/trips";
import TripListCard from "../cards/TripListCard.vue";
let tripStore = useTrips()

let handleScroll = async () => {

  let triggerHeight =
    wrapper.value.scrollTop + wrapper.value.offsetHeight
  console.log(wrapper.value.scrollHeight, triggerHeight)
  if (triggerHeight >= wrapper.value.scrollHeight) {
    await tripStore.fetchTrips()
  }

}

const wrapper = ref(null)
onMounted(() => {
  wrapper.value.addEventListener("scroll", handleScroll);


}



);

</script>

<template>
  <div class="wrapper" ref="wrapper">
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <a-row :gutter="[16, 16]" class="d-flex justify-center mt-8 ">
          <a-col v-if="tripStore.filteredTrips.length == 0" :xs="24" :sm="12" :md="8" :lg="6"
            v-for="trip in tripStore.trips" :key="trip.index">
            <TripListCard :trip="trip" />
          </a-col>

          <a-col v-else :xs="24" :sm="12" :md="8" :lg="6" v-for="filteredTrip in tripStore.filteredTrips"
            :key="filteredTrip.index"  >
            <TripListCard :trip="filteredTrip" />
          </a-col>

        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {

  height: 90vh;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
