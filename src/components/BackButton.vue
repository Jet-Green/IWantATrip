<script setup>
import { useRouter } from "vue-router";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

let router = useRouter();

const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller("md");

function ToStartPage() {
  router.push("/");
}
</script>
<template>
  <a-row type="flex" justify="center" class="ma-16">
    <a-col :xs="22" :lg="16">
      <div @click="router.back()" style="font-size: 18px">
        <span class="mdi mdi-18px mdi-arrow-left-thick" style="color: #245159"></span>

        <span v-if="!sm">Назад</span>
      </div>
    </a-col>
  </a-row>
</template>
<style scoped>
div {
  cursor: pointer;
}
</style>