<script setup>
import MainPageMessage from '../components/sections/MainPageMessage.vue'
import CityGuide from "../components/sections/CityGuide.vue";
import Companions from "../components/sections/Companions.vue";
import CreateTrip from "../components/sections/CreateTrip.vue";
import FindTrip from "../components/sections/FindTrip.vue";
import Explanation from "../components/sections/Explanation.vue";
import Information from "../components/sections/Information.vue";
import TripFilter from "../components/sections/TripFilter.vue";
</script>
<template>
  <div>
    <MainPageMessage />
    <Explanation />
    <Information />

    <!-- <CreateTrip /> -->
    <TripFilter />
    <FindTrip />
    <Companions />
    <CityGuide />
  </div>
</template>
<style lang="scss" scoped>

</style>
