<script setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useRouter } from "vue-router";
import { ref } from "vue";
const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller("md");
let router = useRouter();
const visible = ref(false);

const showDrawer = () => {
  visible.value = !visible.value;
};
const toComponentFromMenu = (routName) => {
  router.push({ name: routName })
  visible.value = !visible.value;
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
            <div @click="router.push({ name: 'TripsPage' })" class="rout">найти тур</div>
            <div @click="router.push({ name: 'CreateTripPage' })" class="rout">создать тур</div>
            <div @click="router.push({ name: 'CompanionsPage' })" class="rout">попутчики</div>
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
    <a-drawer placement="right" :closable="false" :visible="visible" @close="showDrawer" width="200">
      <div @click="toComponentFromMenu('TripsPage')" class="rout">найти тур</div>
      <div @click="toComponentFromMenu('CreateTripPage')" class="rout mt-16 mb-16">создать тур</div>
      <div @click="toComponentFromMenu('CompanionsPage')" class="rout">попутчики</div>
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
.rout {
  cursor: pointer;
  text-transform: uppercase;
}
</style>
