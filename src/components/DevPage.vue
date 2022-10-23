<script setup>
import TripService from "../service/TripService";
const clearTripsDB = () => {
  TripService.clearTripsDB()
};
</script>
<template>
  <div class="d-flex align-center direction-column">
    <a-button
      type="primary"
      size="large"
      class="ma-16 lets_go_btn"
      @click="clearTripsDB()"
    >
      Удалить все туры
    </a-button>

    <a-button
      type="primary"
      size="large"
      class="ma-16 lets_go_btn"
   
    >
      Что-то еще
    </a-button>
  </div>
</template>
<style lang="scss" scoped>
</style>