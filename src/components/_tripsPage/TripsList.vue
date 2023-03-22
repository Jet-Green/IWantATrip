<script setup>
import { onMounted } from 'vue'

import { useTrips } from "../../stores/trips";
import TripListCard from "../cards/TripListCard.vue";

const tripStore = useTrips();

function setupScrollEvent() {
  const onScroll = () => {
    const windowHeight = document.documentElement.clientHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const nearBottom = scrollTop + windowHeight >= scrollHeight - 350;

    if (nearBottom) {
      tripStore.cursor += 5
      tripStore.fetchTrips()
    }
  };

  window.addEventListener('scroll', onScroll);
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
}

onMounted(() => {
  setupScrollEvent();
});

</script>

<template>
  <a-row class="d-flex justify-center">
    <a-col :xs="22" :lg="16">
      <a-row :gutter="[16, 16]" class="mt-8">
        <TransitionGroup name="list">
          <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(trip, index) in tripStore.filteredTrips" :key="index">
            <TripListCard :trip="trip" />
          </a-col>
        </TransitionGroup>
      </a-row>
    </a-col>
  </a-row>
</template>
<!-- <style scoped lang="scss">
.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.list-enter-from // ,

// .list-leave-to 
  {
  opacity: 0;
  transform: translateY(10px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style> -->
