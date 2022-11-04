<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useAuth } from "../stores/auth";

import TripCreatorReg from "./forms/TripCreatorReg.vue";
import RegForm from "./RegForm.vue";
import AuthForm from "./AuthForm.vue";
import LogoSvg from "../components/_explanation/LogoSvg.vue";

const user = useAuth();

let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");
let router = useRouter();
let visibleDrawer = ref(false);
let visibleModal = ref(false);

let isTripCreator = ref(false);
let visibleCreator = ref(false);
let value = ref("Reg");

function showDrawer() {
  visibleDrawer.value = !visibleDrawer.value;
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
const ToCreateTripNoHelp = () => {
  if (user.isAuth) {
    router.push("/create-no-help");
  } else {
    router.push("/reg");
  }
};
// const md = breakpoints.between('sm', 'md')
// const lg = breakpoints.between('md', 'lg')
// const xl = breakpoints.between('lg', 'xl')
// const xxl = breakpoints.between('xl', '2xl')
// const xxxl = breakpoints['2xl']
</script>

<template>
  <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-row type="flex" justify="space-between">
          <a-col :xs="20" :md="12" @click="toComponentFromMenu('Landing')">
            <LogoSvg style="height: 100%"></LogoSvg>
          </a-col>
          <a-col v-if="!sm" :span="12" class="top_menu">
            <div @click="toComponentFromMenu('TripsPage')" class="route">
              найти
            </div>
            <div
              @click="toComponentFromMenu('CreateTripWithHelp')"
              class="route"
            >
              заказать
            </div>
            <div @click="ToCreateTripNoHelp" class="route">создать</div>
            <div @click="toComponentFromMenu('CompanionsPage')" class="route">
              попутчики
            </div>
            <span
              v-if="user.isAuth"
              class="mdi mdi-24px mdi-home"
              @click="toComponentFromMenu('Cabinet')"
              style="cursor: pointer"
              cancelText="отмена"
            >
            </span>
            <span
              v-if="!user.isAuth"
              class="mdi mdi-24px mdi-login"
              @click="toComponentFromMenu('RegForm')"
              style="cursor: pointer"
            >
            </span>
          </a-col>
          <a-col v-else>
            <span
              class="mdi mdi-24px mdi-menu"
              style="color: #245159; cursor: pointer"
              @click="showDrawer"
            ></span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-drawer
      placement="right"
      :closable="false"
      :visible="visibleDrawer"
      @close="showDrawer"
      width="200"
    >
      <div @click="toComponentFromMenu('TripsPage')" class="route ma-8">
        найти тур
      </div>
      <div
        @click="toComponentFromMenu('CreateTripWithHelp')"
        class="route ma-8"
      >
        заказать тур
      </div>
      <div @click="toComponentFromMenu('CreateTripNoHelp')" class="route ma-8">
        создать тур
      </div>
      <div @click="toComponentFromMenu('CompanionsPage')" class="route ma-8">
        попутчики
      </div>
      <div @click="toComponentFromMenu('Cabinet')" class="route ma-8">
        кабинет
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
  }
}

.route {
  cursor: pointer;
  text-transform: uppercase;
}
</style>
