<script setup>
import { useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useAuth } from "../stores/auth";

import TripCreatorReg from "./forms/TripCreatorReg.vue";
import LogoSvg from "../components/_explanation/LogoSvg.vue";

const userStore = useAuth();
let i = ref(null)
let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");
let router = useRouter();
let visibleDrawer = ref(false);
let visibleModal = ref(false);
let showCity = ref(null)
let isTripCreator = ref(false);
let visibleCreator = ref(false);
let value = ref("Reg");


let locationSearchRequest = ref('')
let possibleLocationsToShow = ref([])
let possibleLocations = []

async function selectUserLocation(s) {
  for (let loc of possibleLocations) {
    if (loc.name == s) {
      await userStore.selectUserLocation(loc)
    }
  }
}

function getCity(city) {
  showCity.value = city.key
}

function showDrawer() {
  visibleDrawer.value = !visibleDrawer.value;
  console.log(i)
}
function toComponentFromMenu(routName) {
  router.isReady().then(() => {
    router.push({ name: routName });
  });
  visibleDrawer.value = false;
}
let changeVisibleCreator = () => {
  visibleCreator.value = !visibleCreator.value;
};
const bot = () => {
  window.location.href = "http://t.me/IWantATripBot";
};
// const md = breakpoints.between('sm', 'md')
// const lg = breakpoints.between('md', 'lg')
// const xl = breakpoints.between('lg', 'xl')
// const xxl = breakpoints.between('xl', '2xl')
// const xxxl = breakpoints['2xl']

watch(locationSearchRequest, async (newLocReq) => {
  if (newLocReq.length > 2) {
    let response = await userStore.searchLocation(newLocReq)
    possibleLocations = response.data
    possibleLocationsToShow.value = []
    for (let l of response.data) {
      possibleLocationsToShow.value.push({ value: l.name })
    }
  }
})
onMounted(async () => {
  if (!userStore.user) {
    await userStore.checkAuth()
    if (userStore.user.userLocation.name) {
      locationSearchRequest.value = userStore.user.userLocation.name
    }
  } else {
    locationSearchRequest.value = userStore.user.userLocation.name
  }
})
</script>

<template>
  <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-row type="flex" justify="space-between">
          <a-col v-if="!sm">
            <img src="../assets/images/logo.png" style="padding: 4px; margin-right: 32px" alt=""
              @click="toComponentFromMenu('Landing')" />
            <!-- <LogoSvg></LogoSvg> -->
            <!-- <a-dropdown :trigger="['click']">
                                              <template #overlay>
                
                                              </template>
                                            </a-dropdown> -->
            <!-- <span class="ml-8">{{ showCity }}</span> -->
            <!-- <span class="mdi mdi-24px mdi-map-marker">
                                            </span> -->
          </a-col>
          <a-col :xs="20" :md="7">
            <a-auto-complete style="width: 100%" :options="possibleLocationsToShow" placeholder="Ваше местоположение"
              v-model:value="locationSearchRequest" @select="selectUserLocation">
            </a-auto-complete>
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
            <span v-if="userStore.isAuth" class="mdi mdi-24px mdi-home" @click="toComponentFromMenu('Cabinet')"
              style="cursor: pointer" cancelText="отмена">
            </span>
            <span v-if="!userStore.isAuth" class="mdi mdi-24px mdi-login" @click="toComponentFromMenu('RegForm')"
              style="cursor: pointer">
            </span>
          </a-col>
          <a-col v-else>
            <span class="mdi mdi-24px mdi-menu" style="color: #245159; cursor: pointer" @click="showDrawer"></span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-drawer placement="right" :closable="false" :visible="visibleDrawer" @close="showDrawer" width="200">
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
</style>
