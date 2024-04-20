<script setup>
import { useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useAuth } from "../stores/auth";
import { useLocations } from "../stores/locations";

import { useTrips } from '../stores/trips';
import { useCompanions } from "../stores/companions";
import ruRU from 'ant-design-vue/es/locale/ru_RU';

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
let selectLocationDialog = ref(false);

let locationBar = ref(null);
let find = ref(null);
let order = ref(null);
let companion = ref(null);
let catalog = ref(null);
let auth = ref(null);

let locationSearchRequest = ref('Ваш город')

const open = ref(false);
let currentStep = ref(0);

const steps = [
  {
    title: 'Местоположение',
    description: 'выберите город для поиска туров рядом',
    placement: 'bottom',
    target: () => locationBar.value,
  },
  {
    title: 'Найти',
    description: 'поиск туров',
    placement: 'bottom',
    target: () => find.value,
  },
  {
    title: 'Заказать',
    description: 'заказать тур',
    placement: 'bottom',
    target: () => order.value,
  },
  {
    title: 'Каталог',
    description: 'поиск тура в каталоге',
    placement: 'bottom',
    target: () => catalog.value,
  },
  {
    title: 'Попутчики',
    description: 'поиск попутчиков',
    placement: 'bottom',
    target: () => companion.value,
  },
  {
    title: 'Кабинет',
    description: 'личный кабинет пользователя',
    placement: 'bottom',
    target: () => auth.value,
  },
];

function openHeaderTour(state, step = 0) {
  open.value = state
  if (step > 0) {
    return userStore.showTour(step, 'landingTour', userStore.user._id)
  }
  return userStore.showTour(0, 'landingTour', userStore.user._id)
}
const next = () => {
  currentStep.value++;
};



function toComponentFromMenu(routName) {
  router.isReady().then(() => {
    router.push({ name: routName });
  });
  visibleDrawer.value = false;
}


const handleChange = async () => {

  if (locationSearchRequest.value == 'Ваш город') {
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
userStore.$subscribe((mutation, state) => {
  if (state.user._id && window.screen.width >= 800) {
    if (userStore.user?.educationTours?.landingTour + 1 < steps.length) {
      currentStep.value = userStore.user?.educationTours?.landingTour
      openHeaderTour(true, userStore.user?.educationTours?.landingTour)
    }
    if (!userStore.user?.educationTours?.landingTour) {
      openHeaderTour(true, 0)
    }
  }
})
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
  <a-layout-header :style="{ position: 'fixed', zIndex: 999, width: '100%', background: 'white' }">
    <a-config-provider :locale="ruRU"> <a-tour :open="open" v-model:current="currentStep" :steps="steps"
        @finish='openHeaderTour(false, currentStep)' @click="next"
        @close='openHeaderTour(false, currentStep)' /></a-config-provider>
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-row type="flex" justify="space-between">
          <a-col class="d-flex align-center">

            <img src="../assets/images/logo.webp" style="height: 60px; cursor: pointer" alt=""
              @click="toComponentFromMenu('Landing')" />


          </a-col>

          <a-col>
            <div ref='locationBar' class="location" @click="selectLocationDialog = !selectLocationDialog"
              style="cursor: pointer; font-weight: bold;">
              <span class="mdi mdi-map-marker-outline"></span>
              <span>
                {{ locationSearchRequest ? locationSearchRequest : "Ваш город" }}
              </span>
            </div>
            <a-modal :mask="false" v-model:open="selectLocationDialog" title="Местоположение" :footer="null">

              <a-select v-model:value="locationSearchRequest" style="width: 100%" @change="handleChange" show-search>
                <a-select-option value="Ваш город">Ваш город</a-select-option>
                <a-select-option v-for="(location, index) of locationStore.locations" :key="index"
                  :value="location.shortName">{{ location.name }}</a-select-option>
              </a-select>
            </a-modal>
          </a-col>

          <a-col v-if="!sm" :span="10" class="top_menu">
            <div ref='find' @click="toComponentFromMenu('TripsPage')" class="route">найти</div>
            <div ref='order' @click="toComponentFromMenu('CreateTripWithHelp')" class="route">
              заказать
            </div>
            <div ref='catalog' @click="toComponentFromMenu('CatalogPage')" class="route">
              каталог
            </div>
            <div ref='companion' @click="toComponentFromMenu('CompanionsPage')" class="route">
              попутчики
            </div>
            <span ref='auth' v-if="userStore.isAuth" class="mdi mdi-24px mdi-home" @click="toComponentFromMenu('Me')"
              style="cursor: pointer" cancelText="отмена">
            </span>
            <span ref='auth' v-if="!userStore.isAuth" class="mdi mdi-24px mdi-login"
              @click="toComponentFromMenu('RegForm')" style="cursor: pointer">
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
      <div @click="toComponentFromMenu('CatalogPage')" class="route ma-8">
        каталог
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

.location {
  @media (min-width: 800px) {
    font-size: 16px;
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
// }</style>
