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

      <div class="scroll">
        <div v-for="companion, i in companions" :key="i" style="margin: 15px 25px 15px 25px;">
          <div class="d-flex direction-column align-center" style="width: 50px">
            <span class="mdi mdi-24px mdi-account-outline"></span>
            <span>{{ companion.name }}</span>
            <span>{{ companion.year }} лет</span>
          </div>

        </div>
      </div>

      <a-button type="primary" size="large" class="ma-16 lets_go_btn" @click="router.push('/companions')">
        найти
      </a-button>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
.person_icon {
  height: 70px;
}

.scroll {
  overflow-x: scroll;
  display: flex;
  width: 500px;
}
</style>


