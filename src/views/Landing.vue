<script setup>
import $api from "../plugins/axios";
import { onMounted,ref } from "vue";
// import MainPageMessage from '../components/sections/MainPageMessage.vue'
import CityGuide from "../components/sections/CityGuide.vue";
import ButtonsRow from "../components/sections/ButtonsRow.vue"
import Companions from "../components/sections/Companions.vue";
// import CreateTrip from "../components/sections/CreateTrip.vue";
import FindTrip from "../components/sections/FindTrip.vue";
import Explanation from "../components/sections/Explanation.vue";
// import Information from "../components/sections/Information.vue";
import ToTrips from "../components/sections/ToTrips.vue";
// import Hello from '../components/sections/Hello.vue';
import Footer from '../components/Footer.vue'
import { useRoute } from "vue-router";
// import { useFetch } from "@vueuse/core";
let src=ref('')

const route = useRoute();


onMounted(async () => {
  src.value =await $api.get('https://suggest.travelpayouts.com/search?service=tutu_trains&term=2000000&term2=2064130&callback=n')//nearest in date trains.
  console.log(src.value.data)
  if (route.hash) {
    let id = route.hash.slice(1)
    document.getElementById(id)?.scrollIntoView()
  }
})
</script>
<template>
  <div>
    <Explanation />
    <ButtonsRow />
    <a-row justify="center">
      <a-col :span="6" :md="6">
        <!-- <div id="tpwl-search"></div> -->
        <!-- <div id="tpwl-tickets" style="height:500px ;overflow-y:scroll"></div> -->
        <!-- for aviasales -->
        <!-- {{ src }} for tutu -->
      </a-col>
    </a-row>
    <!-- <ToTrips /> -->
    <FindTrip />
    <!-- <Companions /> -->
    <CityGuide id="guide" />
    <Footer />

  </div>
</template>
<style lang="scss" scoped></style>
