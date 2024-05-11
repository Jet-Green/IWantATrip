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

// знакомство с меню
let open = ref(true);
let currentStep = ref(0);

const steps = [
  {
    title: 'Местоположение',
    description: 'выберите ваш город',
    placement: 'bottom',
    target: () => locationBar.value,
  },
  {
    title: 'Найти',
    description: 'используйте фильтр, выберите тур который вам понравится',
    placement: 'bottom',
    target: () => find.value,
  },
  {
    title: 'Заказать',
    description: 'заполните форму, и мы поможем с выбором тура',
    placement: 'bottom',
    target: () => order.value,
  },
  {
    title: 'Каталог',
    description: 'варианты туров, которые можно организовать в удобное для вас время',
    placement: 'bottom',
    target: () => catalog.value,
  },
  {
    title: 'Попутчики',
    description: 'найдите попутчиков или присоединитесь к другим',
    placement: 'bottom',
    target: () => companion.value,
  },
  {
    title: 'Кабинет',
    description: 'управление аккаунтом, создание и администрирование туров',
    placement: 'bottom',
    target: () => auth.value,
  },
];


function openHeaderTour(state) {
  if (state) {
    open.value = state
    localStorage.setItem('headerTour', true)
  } else {
    currentStep.value = 0
    open.value = false
    localStorage.setItem('headerTour', false)
  }
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

onMounted(() => {

  if (localStorage.getItem('headerTour') == 'false' || !sm.value) {
    open.value = JSON.parse(localStorage?.getItem('headerTour'))
  }

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
    <a-config-provider :locale="ruRU" v-if="!sm">
      <a-tour :open="open" v-model:current="currentStep" :steps="steps" @finish='openHeaderTour(false)' @click="next"
        @close='openHeaderTour(false)' />
    </a-config-provider>
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
            <!-- <span class="mdi mdi-18px mdi-information-variant"
              style="color: #245159; cursor: pointer; margin-top: -10px;" @click="open = !open"></span> -->
            <div class="social">
              <a href="https://vk.com/gorodaivesi_udm" target="_blank"><img src="../assets/icons/vk.svg" alt=""></a>
            </div>
            <div class="social">
              <a href="https://t.me/gorodaivesi_ru" target="_blank"><img src="../assets/icons/telegram.svg" alt=""></a>
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
      width="100%">
      <div style="text-align: right;">
        <span class="mdi mdi-24px mdi-close" style="color: #245159; cursor: pointer"
          @click="visibleDrawer = !visibleDrawer"></span>
        </div>
      <div class="right-drawer">
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
        <div style="text-align:center;">

          <a href="https://vk.com/gorodaivesi_udm" target="_blank"><img class="ma-4" src="../assets/icons/vk.svg"
              alt=""></a>

          <a href="https://t.me/gorodaivesi_ru" target="_blank"><img class="ma-4" src="../assets/icons/telegram.svg"
              alt=""></a>
        </div>
        <img src="../assets/images/logo.webp" class="ma-8" style="height: 60px; cursor: pointer" alt=""
          @click="toComponentFromMenu('Landing')" />
      </div>
    </a-drawer>
  </a-layout-header>
</template>

<style lang="scss" scoped>
.ant-layout-header {
  padding: 0;

  .top_menu {
    display: flex;
    justify-content: space-around;
    font-size: clamp(0.625rem, -2.625rem + 4vw, 0.875rem);
    position: relative;
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

.social {
  transform: translateY(20px);
}

.right-drawer {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
}
</style>
