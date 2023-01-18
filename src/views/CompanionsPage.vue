<script setup>
import { useRouter } from "vue-router";
import { useCompanions } from "../stores/companions";
import BackButton from "../components/BackButton.vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const companionStore = useCompanions();
let router = useRouter();
let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");
const clearData = (dataString) => {
  return new Date(Number(dataString)).toLocaleDateString("ru-Ru", { year: '2-digit', month: '2-digit', day: '2-digit' }).replaceAll("/", ".")
};
const ageString = (age) => {
  if (age >= 10 && age <= 20) {
    return `${age} лет`;
  }
  let arr = age.split("");
  let lastNumber = arr[arr.length - 1];
  if (lastNumber == 1) {
    return `${age} год`;
  }
  if (lastNumber == 2 || lastNumber == 3 || lastNumber == 4) {
    return `${age} года`;
  }
  return `${age} лет`;
};
</script>
<template>
  <div>
    <BackButton></BackButton>

    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>Ищу попутчика</h2>
        <a-row type="flex" justify="center">
          <a-col class="d-flex justify-center">
            <a-button class="lets_go_btn ma-16" type="primary" size="large"
              @click="router.push('/add-companion')">Добавить себя</a-button>
          </a-col>
        </a-row>
      </a-col>

      <a-col :xs="22" :lg="16">
        <a-row class="table_header">
          <a-col :xs="4" :md="3">имя</a-col>
          <a-col :xs="4" :md="2">возраст</a-col>
          <a-col :xs="12" :md="5">направление</a-col>
          <a-col :xs="4" :md="3">попутчик</a-col>
          <a-divider v-if="sm" class="ma-0"></a-divider>
          <a-col :xs="4" :md="2">начало</a-col>
          <a-col :xs="4" :md="2">конец</a-col>
          <a-col :xs="12" :md="5">пожелания</a-col>
          <a-col :xs="4" :md="2">отклик</a-col>
        </a-row>
        <a-row v-for="(companion, i) in companionStore.companions" :key="i"
          :class="companion.gender == 'Male' ? 'men' : 'women'" class="mt-4 pa-8" style="text-align:center">
          <a-col :xs="4" :md="3">{{ companion.name }}</a-col>
          <a-col :xs="4" :md="2">{{ ageString(companion.age) }}</a-col>
          <a-col :xs="12" :md="5">{{ companion.direction }}</a-col>
          <a-col :xs="4" :md="3">{{ companion.gender == "Male" ? "муж" : "жен" }}</a-col>
          <a-divider v-if="sm" class="ma-0"></a-divider>
          <a-col :xs="4" :md="2">{{ clearData(companion.start) }}</a-col>
          <a-col :xs="4" :md="2">{{ clearData(companion.end) }}</a-col>
          <a-col :xs="12" :md="5">{{ companion.description }}</a-col>
          <a-col :xs="4" :md="2"> <a-button shape="circle">
              <span class="mdi mdi-thumb-up-outline"></span>
            </a-button></a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
.women {
  background: rgba(255, 102, 0, 0.05);
}

.men {
  background: rgba(34, 176, 214, 0.05);
}

.table_header {
  text-align: center;
  // background: rgba(34, 176, 214, 0.05) ;
}
</style>

