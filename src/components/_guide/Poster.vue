<script setup>
import { useRouter } from "vue-router"; 
import { ref, computed } from "vue";
import { useLocations } from "../../stores/locations";
import BackButton from "../BackButton.vue";
// let loc_name = JSON.parse(localStorage.getItem("location")).name
const backRoute = { name: 'Landing', hash: '#guide' };

const locationStore = useLocations();
const src = computed(() => {
  const locationName = locationStore?.location?.name;
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
          <!-- <a href="https://plpo.ru" target="_blank">
            <img src="../../assets/plpo.webp" alt="" srcset="" style="max-height: 50px;"></a> -->
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
