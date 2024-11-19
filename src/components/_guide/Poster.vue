<script setup>
import {computed } from "vue";
import { useLocations } from "../../stores/locations";
import BackButton from "../BackButton.vue";

const backRoute = { name: 'Landing', hash: '#guide' };

const locationStore = useLocations();
const src = computed(() => {
  let locationName = locationStore?.location?.name;
  return `https://plpo.ru/frame?location=${encodeURIComponent(locationName)}`;
});
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <h2>
          Афиши
        </h2>
      </a-col>
    </a-row>
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <iframe title="Афиши" style="width: 100%; height:90dvh; border: none" :src='src' id="iframe">

        </iframe>
      </a-col>
    </a-row>


  </div>
</template>
<style scoped>
#iframe {
  -ms-overflow-style: none; 
  scrollbar-width: none;   
}

#iframe::-webkit-scrollbar {
  display: none; 
}

</style>
