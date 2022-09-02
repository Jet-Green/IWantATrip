<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

import RegForm from "./RegForm.vue";
import AuthForm from "./AuthForm.vue"

let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");
let router = useRouter();
let visibleDrawer = ref(false);
let visibleModal = ref(false);

function showDrawer() {
  visibleDrawer.value = !visibleDrawer.value;
};
function showModal() {
  visibleModal.value = !visibleModal.value;
};
async function toComponentFromMenu(routName) {
  router.isReady().then(() => {
    router.push({ name: routName })
  })

  // try {
  // } catch (err) {
  //   console.log('sdfgf')
  // }
  visibleDrawer.value = false;
}
function authorize() {
  visibleModal.value = !visibleModal.value
}
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
          <a-col :xs="20" :md="12">
            <span class="mdi mdi-24px mdi-gnome" style="color: #245159"></span>
            Хочу в поездку
          </a-col>
          <a-col v-if="!sm" :span="12" class="top_menu">
            <div @click="toComponentFromMenu('TripsPage')" class="route">найти тур</div>
            <div @click="toComponentFromMenu('CreateTripWithHelp')" class="route">создать тур</div>
            <div @click="toComponentFromMenu('CompanionsPage')" class="route">попутчики</div>
            <span class="mdi mdi-24px mdi-home" @click="showModal" style="cursor: pointer" cancelText="отмена"></span>
          </a-col>
          <a-col v-else>
            <span class="mdi mdi-24px mdi-menu" style="color: #245159; cursor: pointer" @click="showDrawer"></span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-drawer placement="right" :closable="false" :visible="visibleDrawer" @close="showDrawer" width="200">
      <div @click="toComponentFromMenu('TripsPage')" class="route">найти тур</div>
      <div @click="toComponentFromMenu('CreateTripWithHelp')" class="route mt-16 mb-16">создать тур</div>
      <div @click="toComponentFromMenu('CompanionsPage')" class="route">попутчики</div>
    </a-drawer>
    <a-modal v-model:visible="visibleModal" title="Авторизация" :footer="null">
      <AuthForm @closeModal="visibleModal = false" />
    </a-modal>
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
