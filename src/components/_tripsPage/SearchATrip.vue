<script setup>
import { ref } from 'vue'
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller("md");
let where = ref(null);
let how = ref(null);
let time = ref(null);
function focusOnWhere() {}
function handleChangeOnWhere() {}
</script>
<template>
<a-row display="flex" justify="center"><a-col :xs="20" :md="16" :lg="14">
    <a-row :gutter="[8,8]">
        <a-col :md="5" :xs="12">
          <a-select style="width: 100%" placeholder="Куда едем" v-model:value="where" @focus="focusOnWhere"
            @change="handleChangeOnWhere" :bordered="true" size="large" class="selector">
            <a-select-option value="1"> Туда </a-select-option>
          </a-select>
        </a-col>

        <a-col :md="5" :xs="12">
          <a-select style="width: 100%" placeholder="Как едем" v-model:value="how" @focus="focusOnWhere"
            @change="handleChangeOnWhere" :bordered="true" size="large" class="selector">
            <a-select-option value="1"> Так </a-select-option>
          </a-select>
        </a-col>

        <a-col :md="5" :xs="12">
          <a-select style="width: 100%" placeholder="На сколько" v-model:value="time" @focus="focusOnWhere"
            @change="handleChangeOnWhere" :bordered="true" size="large" class="selector">
            <a-select-option value="1"> На столько </a-select-option>
          </a-select>
        </a-col>

        <a-col :md="5" :xs="12">
          <a-select style="width: 100%" placeholder="На сколько" v-model:value="time" @focus="focusOnWhere"
            @change="handleChangeOnWhere" :bordered="true" size="large" class="selector">
            <a-select-option value="1"> На столько </a-select-option>
          </a-select>
        </a-col>
          <a-button style="height: 15%; border-radius: 15px" type="primary" size="large"
            @click="router.push({ name: 'TripsPage', params: { withTripInfo: false } })" class="ml-4">
            Найти
          </a-button>
          </a-row>
    </a-col></a-row>
</template>
<style scoped>
.select-container {
  background-color: #d9d9d9;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 32px;
}
</style>
