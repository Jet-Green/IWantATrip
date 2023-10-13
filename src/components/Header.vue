<script setup>
import { useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useAuth } from "../stores/auth";
import { useLocations } from "../stores/locations";

import { useTrips } from '../stores/trips';
import { useCompanions } from "../stores/companions";

// import TripCreatorReg from "./forms/TripCreatorReg.vue";
// import LogoSvg from "../components/_explanation/LogoSvg.vue";

const userStore = useAuth();
const locationStore = useLocations();
const companionStore = useCompanions()
const tripStore = useTrips()

let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");
let router = useRouter();
let visibleDrawer = ref(false);
let selectLocationDialog = ref(false)

let locationSearchRequest = ref('Не выбрано')


function toComponentFromMenu(routName) {
  router.isReady().then(() => {
    router.push({ name: routName });
  });
  visibleDrawer.value = false;
}


const handleChange = async () => {

  if (locationSearchRequest.value == 'Не выбрано') {
    locationStore.resetLocation()
    tripStore.cursor = 1
    tripStore.trips = []
    selectLocationDialog.value = false
    await tripStore.fetchTrips()
    await companionStore.fetchCompanions()


  }
  else {
    for (let loc of locationStore.locations) {
      if (loc.shortName == locationSearchRequest.value) {
        // start pagiantion again to update location

        tripStore.cursor = 1
        tripStore.trips = []

        locationStore.setLocation(loc)
        selectLocationDialog.value = false
        await tripStore.fetchTrips()
        await companionStore.fetchCompanions()

        break
      }
    }
  }
};
onMounted(() => {
  if (localStorage.getItem("location")) {
    try {
      locationSearchRequest.value = JSON.parse(localStorage.getItem("location")).shortName
      tripStore.location = JSON.parse(localStorage.getItem("location"))
    } catch (error) {
      localStorage.removeItem('location')
      console.log(error);
    }
  }

})

</script>

<template>
  <a-layout-header :style="{ position: 'fixed', zIndex: 999, width: '100%', background: 'white'}">
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-row type="flex" justify="space-between">
          <a-col class="d-flex align-center">

            <img src="../assets/images/logo.webp" style="height: 60px; cursor: pointer" alt=""
              @click="toComponentFromMenu('Landing')" />


          </a-col>

          <a-col>
            <div @click="selectLocationDialog = !selectLocationDialog" style="cursor: pointer;">
              <span class="mdi mdi-map-marker-outline"></span>
              <span>
                {{ locationSearchRequest }}
              </span>
            </div>
            <a-modal :mask="false" v-model:open="selectLocationDialog" title="Местоположение" :footer="null">

              <a-select v-model:value="locationSearchRequest" style="width: 100%" @change="handleChange" show-search>
                <a-select-option value="Не выбрано">Не выбрано</a-select-option>
                <a-select-option v-for="(location, index) of locationStore.locations" :key="index"
                  :value="location.shortName">{{ location.name }}</a-select-option>
              </a-select>
            </a-modal>
          </a-col>

          <a-col v-if="!sm" :span="10" class="top_menu">
            <div @click="toComponentFromMenu('TripsPage')" class="route">найти</div>
            <div @click="toComponentFromMenu('CreateTripWithHelp')" class="route">
              заказать
            </div>
            <div @click="toComponentFromMenu('CreateTripNoHelp')" class="route">
              создать
            </div>
            <div @click="toComponentFromMenu('CompanionsPage')" class="route">
              попутчики
            </div>
            <span v-if="userStore.isAuth" class="mdi mdi-24px mdi-home" @click="toComponentFromMenu('Me')"
              style="cursor: pointer" cancelText="отмена">
            </span>
            <span v-if="!userStore.isAuth" class="mdi mdi-24px mdi-login" @click="toComponentFromMenu('RegForm')"
              style="cursor: pointer">
            </span>
          </a-col>
          <a-col v-else>
            <span class="mdi mdi-24px mdi-menu" style="color: #245159; cursor: pointer"
              @click="visibleDrawer = !visibleDrawer"></span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-drawer placement="right" :closable="false" :open="visibleDrawer" @close="visibleDrawer = !visibleDrawer"
      width="200">
      <div @click="toComponentFromMenu('Landing')" class="route ma-8">главная</div>
      <div @click="toComponentFromMenu('TripsPage')" class="route ma-8">найти тур</div>
      <div @click="toComponentFromMenu('CreateTripWithHelp')" class="route ma-8">
        заказать тур
      </div>
      <div @click="toComponentFromMenu('CreateTripNoHelp')" class="route ma-8">
        создать тур
      </div>
      <div @click="toComponentFromMenu('CompanionsPage')" class="route ma-8">
        попутчики
      </div>
      <div @click="toComponentFromMenu('Me')" class="route ma-8">кабинет</div>
      <a href="https://doc.gorodaivesi.ru/" target="_blank">
        <div class="route ma-8">о проекте</div>
      </a>
    </a-drawer>
  </a-layout-header>
</template>

<style lang="scss" scoped>
.ant-layout-header {
  padding: 0;

  .top_menu {
    display: flex;
    justify-content: space-around;
  }
}

.route {
  cursor: pointer;
  text-transform: uppercase;
}

// .full-modal {
//   .ant-modal {
//     max-width: 100%;
//     top: 0;
//     padding-bottom: 0;
//     margin: 0;
//   }

//   .ant-modal-content {
//     display: flex;
//     flex-direction: column;
//     height: calc(100vh);
//   }

//   .ant-modal-body {
//     flex: 1;
//   }
// }
</style>
