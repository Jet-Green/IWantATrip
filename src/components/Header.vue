<script setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller("md");
// const md = breakpoints.between('sm', 'md')
// const lg = breakpoints.between('md', 'lg')
// const xl = breakpoints.between('lg', 'xl')
// const xxl = breakpoints.between('xl', '2xl')
// const xxxl = breakpoints['2xl']
function TripsPage() {
  router.push("/trips-page");
}
</script>


<template>
  <a-layout-header>
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-row type="flex" justify="space-between">
          <a-col :xs="20" :md="12">
            <span class="mdi mdi-24px mdi-gnome" style="color: #245159"></span>
            Хочу в поездку
          </a-col>
          <a-col v-if="!sm" :span="12" class="top_menu">
            <div @click="TripsPage">найти тур</div>
            <div>создать тур</div>
            <div>попутчики</div>
          </a-col>
          <a-col v-else class="burger_menu">
            <span class="mdi mdi-24px mdi-menu" style="color: #245159"></span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-layout-header>
</template>


<style lang="scss" scoped>
.ant-layout-header {
  text-transform: uppercase;
  padding: 0;

  .top_menu {
    display: flex;
    justify-content: space-around;
  }

  .burger_menu {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;

  }
}
</style>