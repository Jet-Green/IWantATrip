<script setup>
import BackButton from "../BackButton.vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { ref } from "vue";
const route = useRoute();

const _id = route.query._id;

const backRoute = "/trips";

let trip = ref({});

axios
  .get(`${import.meta.env.VITE_API_URL}/trips/get-by-id?_id=${_id}`)
  .then((response) => {
    trip.value = response.data;
    console.log(trip.value);
    let humans=trip.value.fromAge;
    if (humans>trip.value.maxPeople){
      console.log('too many')
      return humans
    }
    let mainprice = trip.value.cost[0].price;
    let maxhumans=Math.ceil(humans/10)
    let groupprice = humans*trip.value.cost[1].price/maxhumans;
    trip.value.mainprice = mainprice;
    trip.value.groupprice = groupprice;
  })
  .catch((error) => {
    console.log(error);
  });

</script>
<template>
  <BackButton :backRoute="backRoute" />
  <a-row type="flex" justify="center" align="top">
    <a-col :span="6">
      <h1>mainprice {{ trip.mainprice }}</h1>
    </a-col>
    <a-col :span="6">
      <h1>groupprice {{ trip.groupprice }}</h1>
    </a-col>
  </a-row>
</template>
<style></style>
