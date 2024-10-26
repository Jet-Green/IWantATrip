<script setup>
import BackButton from "../components/BackButton.vue"
import PlaceCard from "../components/cards/PlaceCard.vue"
import places from '../db/places.json'
import PlaceFilter from "../components/_guide/PlaceFilter.vue";
const backRoute = { name: 'Landing', hash: '#guide' };
</script>
<template>
  <div style="overflow-x: hidden" id="top">
    <BackButton :backRoute="backRoute" />
    <a-row class="justify-center d-flex">

      <a-col :xs="22" :xl="16">
        <h2 >Места</h2>
        <PlaceFilter />
        <PlaceCard :place="place" v-for="place, index in places" :key="index" />

      </a-col>
    </a-row>
  </div>
</template>
