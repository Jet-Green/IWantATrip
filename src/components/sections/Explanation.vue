<script setup>
import { reactive, watch, ref } from "vue";
import StartImage from "../_explanation/StartSvgImg.vue";

import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller("md");
</script>
<template>
  <a-row>
    <a-col :span="24">
      <StartImage style="width: 100%"></StartImage>

   
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>




</style>
