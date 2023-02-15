<script setup>
import MainPageMessage from '../components/sections/MainPageMessage.vue'
import CityGuide from "../components/sections/CityGuide.vue";
import Companions from "../components/sections/Companions.vue";
import CreateTrip from "../components/sections/CreateTrip.vue";
import FindTrip from "../components/sections/FindTrip.vue";
import Explanation from "../components/sections/Explanation.vue";
import Information from "../components/sections/Information.vue";
import ToTrips from "../components/sections/ToTrips.vue";
import Hello from '../components/sections/Hello.vue';
</script>
<template>
  <div>
    <MainPageMessage />
    <Explanation />
    <Hello />
    <!-- <Information /> -->

    <!-- <CreateTrip /> -->
    <ToTrips />
    <FindTrip />
    <Companions />
    <CityGuide />
  </div>
</template>
<style lang="scss" scoped>

</style>
