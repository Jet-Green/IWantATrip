<script setup>
import BackButton from "../components/BackButton.vue"
import PlaceCategoryCard from "../components/cards/PlaceCategoryCard.vue"
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton />
    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
        Места по категориям
        <PlaceCategoryCard />
      </a-col>
    </a-row>
  </div>
</template>
