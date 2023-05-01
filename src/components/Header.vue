<script setup>
import { useRouter } from "vue-router";
import { ref, watch, } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useAuth } from "../stores/auth";

// import TripCreatorReg from "./forms/TripCreatorReg.vue";
// import LogoSvg from "../components/_explanation/LogoSvg.vue";

const userStore = useAuth();
let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");
let router = useRouter();
let visibleDrawer = ref(false);
let selectLocationDialog = ref(false)

let locationSearchRequest = ref('')
let possibleLocations = ref([])

async function selectLocation(event) {
  let index = event.key

  await userStore.selectUserLocation(possibleLocations.value[index])
  userStore.user.userLocation = possibleLocations.value[index]

  selectLocationDialog.value = false
}
function toComponentFromMenu(routName) {
  router.isReady().then(() => {
    router.push({ name: routName });
  });
  visibleDrawer.value = false;
}
// const md = breakpoints.between('sm', 'md')
// const lg = breakpoints.between('md', 'lg')
// const xl = breakpoints.between('lg', 'xl')
// const xxl = breakpoints.between('xl', '2xl')
// const xxxl = breakpoints['2xl']

watch(locationSearchRequest, async (newLocReq) => {
  if (newLocReq.length > 2) {
    let response = await userStore.searchLocation(newLocReq)
    possibleLocations.value = response.data
  } else if (newLocReq.length == 0) {
    possibleLocations.value = []
  }
})
</script>

<template>
  <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-row type="flex" justify="space-between">
          <a-col v-if="!sm">
            <img src="../assets/images/logo.png" style="padding: 4px; margin-right: 32px; cursor: pointer" alt=""
              @click="toComponentFromMenu('Landing')" />
          </a-col>
          <a-col :xs="20" :md="7">
            <div @click="selectLocationDialog = !selectLocationDialog" style="cursor: pointer;">
              <span class="mdi mdi-map-marker-outline"></span>
              <span v-if="userStore.user?.userLocation?.shortName">
                {{ userStore.user?.userLocation?.shortName }}
              </span>
              <span v-else-if="userStore.user?.userLocation?.name">
                {{ userStore.user?.userLocation?.name }}
              </span>
              <span v-else>
                Ваше местоположение
              </span>
            </div>
            <a-modal :mask="false" v-model:visible="selectLocationDialog" title="Местоположение" :footer="null">
              <a-row>
                <a-col :span="24">
                  <a-input v-model:value="locationSearchRequest" allow-clear>
                  </a-input>
                  <a-menu @select="selectLocation">
                    <a-menu-item v-for="(location, index) of possibleLocations" :key="index">
                      {{ location.name }}
                    </a-menu-item>
                  </a-menu>
                </a-col>
              </a-row>
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
            <span v-if="userStore.isAuth" class="mdi mdi-24px mdi-home" @click="toComponentFromMenu('Cabinet')"
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
