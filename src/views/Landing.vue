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


import NearbyTrips from "../components/ladingPage/NearbyTrips.vue";
import FirstSection from "../components/ladingPage/FirstSection.vue";
import ExcursionsModule from "../components/ladingPage/ExcursionsModule.vue";
import TracksModule from "../components/ladingPage/TracksModule.vue";

import { useRoute } from "vue-router";


const route = useRoute();


onMounted(() => {
  if (route.hash) {
    let id = route.hash.slice(1)
    document.getElementById(id)?.scrollIntoView()
  }
})
</script>
<template>
  <div style="background-color: #FFFEF4;">
    <FirstSection />
    <NearbyTrips style="margin-top: 100px;" />

    <a-row type="flex" justify="center" style="margin-top: 100px;">
      <a-col :span="22">
        <h2 class="big-text">Давайте спланируем <br> ваше путешествие</h2>
      </a-col>
    </a-row>

    <ExcursionsModule />

    <TracksModule />


    <!-- <Explanation />
    <ButtonsRow />
    <FindTrip />
    <CityGuide id="guide"/>
     -->
    <Footer />
  </div>
</template>
<style lang="scss" scoped>
.big-text {
  font-size: clamp(1.25rem, -0.8381rem + 5.9659vw, 3.875rem);
  line-height: 1;
  font-weight: 900;
}
</style>
