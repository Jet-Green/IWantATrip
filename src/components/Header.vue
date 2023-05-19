<script setup>
import { useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useAuth } from "../stores/auth";
import { useLocations } from "../stores/locations";

import { useTrips } from '../stores/trips';

// import TripCreatorReg from "./forms/TripCreatorReg.vue";
// import LogoSvg from "../components/_explanation/LogoSvg.vue";

const userStore = useAuth();
const appLocations = useLocations();

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


const handleChange = async (value) => {
  if (value == 'Не выбрано') {
    appLocations.location = {}
    tripStore.searchCursor = 0
    tripStore.filteredTrips = []
    tripStore.cursor = 0
    tripStore.trips = []

    await tripStore.fetchTrips()
  }
  else {
    for (let loc of appLocations.locations) {
      if (loc.shortName == value) {
        appLocations.location = loc
        // start pagiantion again to update location
        tripStore.searchCursor = 0
        tripStore.filteredTrips = []
        tripStore.cursor = 0
        tripStore.trips = []
        localStorage.setItem('location', JSON.stringify(loc));
        await tripStore.fetchTrips()
        return
      }
    }
  }
};



</script>

<template>
  <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-row type="flex" justify="space-between">
          <a-col v-if="!sm" class="d-flex align-center">

            <img src="../assets/images/logo.png" style="height: 60px; cursor: pointer" alt=""
              @click="toComponentFromMenu('Landing')" />


          </a-col>
          <a-col :xs="20" :md="7">
            <div @click="selectLocationDialog = !selectLocationDialog" style="cursor: pointer;">
              <span class="mdi mdi-map-marker-outline"></span>
              <span>
                {{ appLocations.location?.shortName || 'Не выбрано' }}
              </span>
            </div>
            <a-modal :mask="false" v-model:visible="selectLocationDialog" title="Местоположение" :footer="null">

              <a-select v-model:value="locationSearchRequest" style="width: 100%" @change="handleChange" show-search>
                <a-select-option value="Не выбрано">Не выбрано</a-select-option>
                <a-select-option v-for="(location, index) of appLocations.locations" :key="index"
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
    <a-drawer placement="right" :closable="false" :visible="visibleDrawer" @close="visibleDrawer = !visibleDrawer"
      width="200">
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
      <div @click="toComponentFromMenu('Cabinet')" class="route ma-8">кабинет</div>
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
