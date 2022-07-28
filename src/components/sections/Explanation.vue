<script setup>
import { reactive, watch } from "vue";

import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller("md");
</script>
<template>
  <a-row>
    <a-col :span="24" style="height: 60vh">
      <div class="topImage"></div>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
h1 {
  text-align: center;
  font-size: clamp(14px, 5vw, 36px);
}
.topImage {
  background-image: url("../../assets/images/topImage.jpg");
  height: 100%; 
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
