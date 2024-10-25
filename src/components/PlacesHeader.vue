<script setup>
import { useRouter } from "vue-router"
import { ref, watch, onMounted, computed } from "vue"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import { useAuth } from "../stores/auth"
import { useLocations } from "../stores/locations"

import { useTrips } from "../stores/trips"
import { useCompanions } from "../stores/companions"
import { storeToRefs } from "pinia"

// import TripCreatorReg from "./forms/TripCreatorReg.vue";
// import LogoSvg from "../components/_explanation/LogoSvg.vue";

const userStore = useAuth()
const locationStore = useLocations()
const companionStore = useCompanions()
const tripStore = useTrips()

let breakpoints = useBreakpoints(breakpointsTailwind)
let sm = breakpoints.smaller("md")
let router = useRouter()
let visibleDrawer = ref(false)
let { selectLocationDialog } = storeToRefs(locationStore)

let locationBar = ref(null)
let find = ref(null)
let order = ref(null)
let companion = ref(null)
let catalog = ref(null)
let auth = ref(null)

let locationSearchRequest = ref("Ваш город")

function toComponentFromMenu(routName) {
  router.isReady().then(() => {
    router.push({ name: routName })
  })
  visibleDrawer.value = false
}

let drawerWidth = computed(() => {
  return sm.value ? "100%" : "30%"
})
const handleChange = async () => {
  if (locationSearchRequest.value == "Ваш город") {
    locationStore.resetLocation()
    tripStore.cursor = 1
    tripStore.trips = []
    selectLocationDialog.value = false
    await tripStore.fetchTrips()

    tripStore.catalogCursor = 1
    tripStore.catalog = []

    await tripStore.fetchCatalogTrips()
    await companionStore.fetchCompanions()
  } else {
    for (let loc of locationStore.locations) {
      if (loc.shortName == locationSearchRequest.value) {
        // start pagination again to update location

        tripStore.cursor = 1
        tripStore.trips = []

        locationStore.setLocation(loc)
        selectLocationDialog.value = false
        await tripStore.fetchTrips()

        tripStore.catalogCursor = 1
        tripStore.catalog = []

        await tripStore.fetchCatalogTrips()
        await companionStore.fetchCompanions()

        break
      }
    }
  }
}

onMounted(() => {
  if (localStorage.getItem("location")) {
    try {
      locationSearchRequest.value = JSON.parse(localStorage.getItem("location")).shortName
      tripStore.location = JSON.parse(localStorage.getItem("location"))
    } catch (error) {
      localStorage.removeItem("location")
      console.log(error)
    }
  }
})
</script>

<template>
  <a-layout-header :style="{ position: 'fixed', zIndex: 999, width: '100%', background: 'white' }">
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-row type="flex" justify="space-between">
          <a-col class="d-flex align-center">
            <img
              src="../assets/images/logo.webp"
              style="height: 60px; cursor: pointer"
              alt=""
              @click="toComponentFromMenu('Landing')"
            />
          </a-col>

          <!-- <a-col>
            <div
              ref="locationBar"
              class="location"
              @click="selectLocationDialog = !selectLocationDialog"
              style="cursor: pointer; font-weight: bold"
            >
              <span class="mdi mdi-map-marker-outline"></span>
              <span>
                {{ locationSearchRequest ? locationSearchRequest : "Ваш город" }}
              </span>
            </div>
            <a-modal :mask="false" v-model:open="selectLocationDialog" title="Местоположение" :footer="null" :zIndex=999>
              <a-select v-model:value="locationSearchRequest" style="width: 100%" @change="handleChange" show-search >
                <a-select-option value="Ваш город">Ваш город</a-select-option>
                <a-select-option
                  v-for="(location, index) of locationStore.locations"
                  :key="index"
                  :value="location.shortName"
                  >{{ location.name }}</a-select-option
                >
              </a-select>
            </a-modal>
          </a-col> -->

          <a-col class="top_menu">
            <!-- <div ref='find' @click="toComponentFromMenu('TripsPage')" class="route">найти</div>
            <div ref='order' @click="toComponentFromMenu('CreateTripWithHelp')" class="route">
              заказать
            </div>
            <div ref='catalog' @click="toComponentFromMenu('CatalogPage')" class="route">
              каталог
            </div>
            <div ref='companion' @click="toComponentFromMenu('CompanionsPage')" class="route">
              попутчики
            </div> -->

            <div class="ma-4">
              <a href="https://vk.com/gorodaivesi_udm" target="_blank"><img src="../assets/icons/vk.svg" alt="" /></a>
            </div>
            <div class="ma-4">
              <a href="https://t.me/gorodaivesi_ru" target="_blank"
                ><img src="../assets/icons/telegram.svg" alt=""
              /></a>
            </div>

            <!-- <span ref='auth' v-if="userStore.isAuth" class="mdi mdi-24px mdi-home" @click="toComponentFromMenu('Me')"
              style="cursor: pointer" cancelText="отмена">
            </span>

            <span ref='auth' v-if="!userStore.isAuth" class="mdi mdi-24px mdi-login"
              @click="toComponentFromMenu('RegForm')" style="cursor: pointer">
            </span> -->
          </a-col>
          <a-col>
            <span
              class="mdi mdi-24px mdi-menu"
              style="color: #245159; cursor: pointer"
              @click="visibleDrawer = !visibleDrawer"
            ></span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <a-drawer
      placement="right"
      :closable="false"
      :open="visibleDrawer"
      @close="visibleDrawer = !visibleDrawer"
      :width="drawerWidth"
    >
      <div style="text-align: right">
        <span
          class="mdi mdi-24px mdi-close"
          style="color: #245159; cursor: pointer"
          @click="visibleDrawer = !visibleDrawer"
        ></span>
      </div>
      <div class="right-drawer">
        <div @click="toComponentFromMenu('Me')" class="route ma-8" style="text-align: center; font-weight: bold">
          <div>
            <span
              ref="auth"
              v-if="userStore.isAuth"
              class="mdi mdi-24px mdi-home"
              @click="toComponentFromMenu('Me')"
              style="cursor: pointer"
              cancelText="отмена"
            >
            </span>

            <span
              ref="auth"
              v-if="!userStore.isAuth"
              class="mdi mdi-24px mdi-login"
              @click="toComponentFromMenu('RegForm')"
              style="cursor: pointer"
            >
            </span>
          </div>
          <div class="mr-4">кабинет</div>
        </div>
        <div style="width: 50%">
          <a-divider class="ma-0"></a-divider>
        </div>

        <div @click="toComponentFromMenu('Landing')" class="route ma-8">главная</div>
        <div @click="toComponentFromMenu('TripsPage')" class="route ma-8">найти тур</div>
        <div @click="toComponentFromMenu('CreateTripWithHelp')" class="route ma-8">заказать тур</div>
        <div @click="toComponentFromMenu('CatalogPage')" class="route ma-8">каталог</div>
        <div @click="toComponentFromMenu('CreateTripNoHelp')" class="route ma-8">создать тур</div>
        <div @click="toComponentFromMenu('SendIdea')" class="route ma-8">подать идею</div>
        <div @click="toComponentFromMenu('CompanionsPage')" class="route ma-8">попутчики</div>
        <div style="width: 50%">
          <a-divider class="ma-0"></a-divider>
        </div>
        <div class="guide">
          <!-- <h4 class="rotated-text">Гид по городу <br> <span>
            {{ locationSearchRequest ? locationSearchRequest : "Ваш город" }}
          </span></h4> -->

          <div @click="toComponentFromMenu('ExcursionsPage')" class="route ma-8">экскурсии</div>
          <div @click="toComponentFromMenu('CreateExcursion')" class="route ma-8">создать экскурсию</div>
          <div @click="toComponentFromMenu('Poster')" class="route ma-8">афиши</div>
          <div @click="toComponentFromMenu('Transport')" class="route ma-8">транспорт</div>
          <div @click="toComponentFromMenu('ToStay')" class="route ma-8">гостиницы</div>
        </div>

        <div style="width: 50%">
          <a-divider class="ma-0"></a-divider>
        </div>
        <div @click="toComponentFromMenu('Contacts')" class="route ma-8">контакты</div>
        <div @click="toComponentFromMenu('Documents')" class="route ma-8">документы</div>
        <div style="text-align: center">
          <a href="https://vk.com/gorodaivesi_udm" target="_blank"
            ><img class="ma-4" src="../assets/icons/vk.svg" alt=""
          /></a>

          <a href="https://t.me/gorodaivesi_ru" target="_blank"
            ><img class="ma-4" src="../assets/icons/telegram.svg" alt=""
          /></a>
        </div>
        <img
          src="../assets/images/logo.webp"
          class="ma-8"
          style="height: 60px; cursor: pointer"
          alt=""
          @click="toComponentFromMenu('Landing')"
        />
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

  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    color: #ff6600;
  }
}

// .social {
//   transform: translateY(15px);
// }

.right-drawer {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 600;
}

.guide {
  text-align: center;
  background-color: rgb(235, 234, 234);
  width: 100%;
}
</style>
