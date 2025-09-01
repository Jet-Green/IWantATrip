<script setup>
import { ref, onMounted, computed } from "vue";
import StartImage from "../_explanation/StartSvgImg.vue";

import { useLocations } from "../../stores/locations";

const locationStore = useLocations()

let isLocationImg = ref(true)


const location = computed(() => {
  return locationStore.location
});

onMounted(() => {

})


</script>
<template>
  <a-row style="background:#64bed8; ">
    <a-col :span="24" style="text-align: center; ">
      <div v-if="!location?.image" class="slogan">Cообщество гостеприимных территорий</div>
      <StartImage v-if="!location?.image" style="width: 100%;"></StartImage>

      <img v-if="location?.image" :src="location?.image" alt="" class="location_img">
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
.slogan {
  text-align: center;
  transform: translateY(120%);
  font-family: 'Caveat', cursive;
  font-size: clamp(1.25rem, -0.15rem + 5.6vw, 3rem);
  color: white;
  font-weight: 700;
  height: 0;


}

.location_img {


max-width: 80%;
  max-height: 400px;
  // object-fit: cover;
  object-position: center;
  background-color: #64bed8;

  mask-image:
    linear-gradient(to bottom, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%),
    linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%);
  mask-composite: intersect;


  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: cover;

}
</style>
