<script setup>
import { onMounted } from "vue";
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


const route = useRoute();


onMounted (()=>{
  if(route.hash) {
    let id = route.hash.slice(1)
    document.getElementById(id)?.scrollIntoView()
  }
})
</script>
<template>
  <div>
    <Explanation />
    <ButtonsRow />
    <ToTrips />
    <FindTrip />
    <Companions />
    <CityGuide id="guide"/>
    <Footer/>
  
  </div>
</template>
<style lang="scss" scoped></style>
