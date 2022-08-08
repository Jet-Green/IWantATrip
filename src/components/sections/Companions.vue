<script setup>
import { reactive } from "vue";

import { useRouter } from 'vue-router'

import person from "../../assets/icons/person_black_24dp.svg";

let router = useRouter();


let companions = reactive([
  {
    name: "Вася",
    year: 27,
  },
  {
    name: "Вася",
    year: 33,
  },
  {
    name: "Вася",
    year: 45,
  },
  {
    name: "Вася",
    year: 19,
  },
  {
    name: "Вася",
    year: 38,
  },
]);
</script>
<template>
  <a-row display="flex" justify="center">
    <a-col :lg="16" :xs="24" align="middle">
      <h2 class="mt-16">Найди попутчиков</h2>

      <a-row display="flex" justify="center">
        <a-col v-for="companion,i in companions"  :key="i" :xs="4" :lg="4" class="ma-4">
        <div class="d-flex direction-column align-center">
          <UserOutlined />
          <span class="mdi mdi-36px mdi-account-outline"></span>
          <span >{{ companion.name }}</span>
          <span >{{ companion.year }} лет</span>
        </div>
         
        </a-col>
      </a-row>

      <a-button
        type="primary"
        size="large"
        class="ma-16 lets_go_btn"
        @click="toCompanionsPage"
      >
        найти
      </a-button>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
.person_icon{
height:70px;
}
</style>


