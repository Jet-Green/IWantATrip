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
        <a-col v-if="!sm" :xs="22" :lg="16">
            <div @click="ToStartPage">
                <span class="mdi mdi-arrow-left-thick" style="color: #245159"></span>
                Назад
            </div>
        </a-col>
        <a-col v-else :xs="22" :lg="16">
            <div @click="ToStartPage">
                <span class="mdi mdi-arrow-left-thick" style="color: #245159"></span>
            </div>
        </a-col>
    </a-row>
</template>
<style scoped>
div {
    cursor: pointer;
}
</style>