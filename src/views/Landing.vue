<script setup>
import CityGuide from "../components/sections/CityGuide.vue";
import Companions from "../components/sections/Companions.vue";
import CreateTrip from "../components/sections/CreateTrip.vue";
import FindTrip from "../components/sections/FindTrip.vue";
import Explanation from "../components/sections/Explanation.vue";
</script>
<template>
  <a-row type="flex" justify="center">
    <a-col :span="20">
      <Explanation />
      <CreateTrip />
      <FindTrip />
      <Companions />
      <CityGuide />
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
</style>
