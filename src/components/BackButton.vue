<script setup>
import { useRouter } from "vue-router";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

let router = useRouter();

let props = defineProps({
  backRoute: Object,
});

const getHistoryLength = () => { return window.history.length }

const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller("md");
</script>
<template>
  <a-row type="flex" justify="center" class="mb-8">
    <a-col :xs="22" :lg="16">
      <span @click="backRoute ? router.push(backRoute) : router.back()"
        style="font-size: 16px; line-height: 32px; cursor: pointer">
        <a-button shape="circle" type="text">
          <template #icon>
            <span class="mdi mdi-arrow-left" style="font-size:16px"></span>
          </template>
        </a-button>
        <span v-if="!sm">Назад</span>
      </span>
    </a-col>
  </a-row>
</template>