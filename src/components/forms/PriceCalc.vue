<script setup>
import { useRoute } from "vue-router";
import axios from "axios";
import { ref } from "vue";
const route = useRoute();

const _id = route.query._id;

const backRoute = "/trips";

let trip = ref({});
let mainprice = ref(0);
let groupprice = ref(0);
axios
  .get(`${import.meta.env.VITE_API_URL}/trips/get-by-id?_id=${_id}`)
  .then((response) => {
    trip.value = response.data;
    console.log(trip.value);
  })
  .catch((error) => {
    console.log(error);
  });

async function calculate(){
    mainprice = x*trip.value.cost[0].price
}
</script>
<template>
  <BackButton :backRoute="backRoute" />
  <a-row>
    <a-col :span="12">
      <h1>{{ mainprice }}</h1>
    </a-col>
    <a-col :span="12">
      <h1>{{ groupprice }}</h1>
    </a-col>
  </a-row>
</template>
<style></style>
