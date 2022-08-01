<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller("md");

let router = useRouter();
let where = ref(null);
let how = ref(null);
let time = ref(null);

function toEventPage() {
  router.push({ name: "EventPage", params: { type: "event" } });
}
function focusOnWhere() { }
function handleChangeOnWhere() { }
</script>
<template>
  <a-row type="flex" justify="center" align="middle" class="section_bg pt-16 pb-16">
    <a-col :span="24">
      <h2 style="text-align: center">Найди свой идеальный отдых</h2>
    </a-col>
    <a-col :xs="22" :md="16" :lg="14">
      <a-row :gutter="[8, 8]" type="flex" justify="center">
        <a-col :xs="12">
          <a-select style="width: 100%" placeholder="Куда едем" v-model:value="where" @focus="focusOnWhere"
            @change="handleChangeOnWhere" :bordered="true" size="large" class="selector">
            <a-select-option value="1"> Туда </a-select-option>
          </a-select>
        </a-col>

        <a-col :xs="12">
          <a-select style="width: 100%" placeholder="Как едем" v-model:value="how" @focus="focusOnWhere"
            @change="handleChangeOnWhere" :bordered="true" size="large" class="selector">
            <a-select-option value="1"> Так </a-select-option>
          </a-select>
        </a-col>

        <a-col :xs="12">
          <a-select style="width: 100%" placeholder="На сколько" v-model:value="time" @focus="focusOnWhere"
            @change="handleChangeOnWhere" :bordered="true" size="large" class="selector">
            <a-select-option value="1"> На столько </a-select-option>
          </a-select>
        </a-col>

        <a-col :xs="12">
          <a-select style="width: 100%" placeholder="На сколько" v-model:value="time" @focus="focusOnWhere"
            @change="handleChangeOnWhere" :bordered="true" size="large" class="selector">
            <a-select-option value="1"> На столько </a-select-option>
          </a-select>
        </a-col>


        <a-button style="border-radius: 15px" type="primary" size="large" @click="
          router.push({
            name: 'TripsPage',
          })
        " class="ma-16">
          Найти
        </a-button>

      </a-row>
    </a-col>
  </a-row>
</template>



<style lang="scss" scoped>
.section_bg {
  background: rgba(0, 0, 0, 0.3);
  min-height: 30vh;
}
</style>