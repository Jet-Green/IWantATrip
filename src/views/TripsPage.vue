<script setup>
import { ref, onMounted } from "vue";
import TripFilter from "../components/sections/TripFilter.vue";
import TripsList from "../components/_tripsPage/TripsList.vue";
import BackButton from "../components/BackButton.vue";
import { useTrips } from "../stores/trips";
import { useRoute } from "vue-router";

const tripStore = useTrips();

const route = useRoute();

</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>Туры</h2>
      </a-col>
    </a-row>
    <TripFilter :search="route.query.search" />
    
    <TripsList />
  </div>
</template>
