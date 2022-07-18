<script setup>
import CityGuide from "../components/sections/CityGuide.vue";
import Companions from "../components/sections/Companions.vue";
import CreateTrip from "../components/sections/CreateTrip.vue";
import FindTrip from "../components/sections/FindTrip.vue";
</script>
<template>
  <a-row type="flex" justify="center">
    <a-col :xs="24" :sm="20">
      <CreateTrip />
      <FindTrip />
      <Companions />
      <CityGuide />
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
</style>