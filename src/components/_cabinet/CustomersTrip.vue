<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useTrips } from "../../stores/trips";

const tripStore = useTrips();
let route = useRoute();

const _id = route.query.id;
let trip = ref({});

tripStore
  .getById(_id)
  .then((response) => {
    trip.value = response.data;
  })
  .catch((error) => {
    console.log(error);
  });

console.log(trip.value)

</script>
<template>

</template>
<style scoped>

</style>