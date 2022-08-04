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

      <div class="lets_go_btn_container">
        <a-button type="primary" class="lets_go_btn" size="large">
          Поехали!
        </a-button>
      </div>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
h1 {
  text-align: center;
}

.lets_go_btn_container {
  position: absolute;
  bottom: -12px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;


}
</style>
