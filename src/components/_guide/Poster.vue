<script setup>
import {computed } from "vue";
import { useLocations } from "../../stores/locations";
import BackButtonAdaptive from "../BackButtonAdaptive.vue";

const backRoute = { name: 'Landing', hash: '#guide' };

const locationStore = useLocations();
const src = computed(() => {
  let locationName = locationStore?.location?.name;
  return `https://plpo.ru/frame?location=${encodeURIComponent(locationName)}`;
});
</script>
<template>
  <div>
    <a-row type="flex" justify="center">
      <a-col :xs="22" :md="20" :xl="18">
        <BackButtonAdaptive :backRoute="backRoute" />
        
        <h2 class="title">Афиши</h2>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center">
      <a-col :xs="22" :md="20" :xl="18">
        <iframe title="Афиши" style="width: 100%; height:90dvh; border: none" :src='src' id="iframe">

        </iframe>
      </a-col>
    </a-row>


  </div>
</template>
<style scoped>
.title {
  font-weight: 900;
}

#iframe {
  -ms-overflow-style: none; 
  scrollbar-width: none;   
}

#iframe::-webkit-scrollbar {
  display: none; 
}
</style>
