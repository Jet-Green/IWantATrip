<script setup>
import { useRouter } from "vue-router";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

let router = useRouter();

let props = defineProps({
  backRoute: String,
});

const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller("md");
</script>
<template>
  <a-row type="flex" justify="center">
    <a-col :xs="22" :lg="16">
      <div
        @click="router.push(backRoute ? backRoute : '/')"
        style="font-size: 16px; margin-top: 8px; line-height: 32px;"
        class="d-flex"
      >
        <a-button shape="circle" class="d-flex justify-center align-center">
          <span class="mdi mdi-arrow-left" style="font-size:20px"></span>
        </a-button>

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