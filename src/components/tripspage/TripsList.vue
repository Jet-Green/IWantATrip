<script setup>
import { reactive } from "vue";
import TripCard from "../cards/TripCard.vue";

let tours = reactive([
  {
    image: "https://страна2-0.рф/wp-content/uploads/2020/09/W50HIZer2wQ-1024x682.jpg",
    eventName: "БИ-2",
  },

  {
    image: "https://страна2-0.рф/wp-content/uploads/2020/09/W50HIZer2wQ-1024x682.jpg",
    eventName: "БИ-2",
  },

  {
    image: "https://страна2-0.рф/wp-content/uploads/2020/09/W50HIZer2wQ-1024x682.jpg",
    eventName: "БИ-2",
  },
]);
</script>

<template>
  <a-row display="flex" justify="center">
    <a-col :xs="22" :lg="16">
      <a-row>
        <a-col :span="5" v-for="tour in tours">
          <TripCard
            :tour="tour"
          />
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style scoped></style>
