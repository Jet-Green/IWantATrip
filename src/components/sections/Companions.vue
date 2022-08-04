<script setup>
import { reactive } from "vue";

import { useRouter } from 'vue-router'

import person from "../../assets/icons/person_black_24dp.svg";

let router = useRouter()

let companions = reactive([
  {
    named: "Вася",
    year: 27,
  },
  {
    named: "Вася",
    year: 33,
  },
  {
    named: "Вася",
    year: 45,
  },
  {
    named: "Вася",
    year: 19,
  },
  {
    named: "Вася",
    year: 38,
  },
]);
</script>
<template>
  <a-row display="flex" justify="center">
    <a-col :lg="16" :xs="24" align="middle">
      <h2 class="mt-16">Найдите попутчиков</h2>

      <a-row display="flex" justify="center">
        <a-col v-for="companion,i in companions"  :key="i" :xs="4" :lg="4" class="ma-4">
          <img :src="person" alt="" srcset="" class="img mb-8" />
          <h2 class="mb-8">{{ companion.named }}</h2>
          <h3 class="mb-16">{{ companion.year }} лет</h3>
        </a-col>
      </a-row>

      <a-button type="primary" shape="round" size="large" class="mb-16" @click="router.push('/companions')">
        Показать всех
      </a-button>
    </a-col>
  </a-row>
</template>
<style scoped>
.img {
  background-color: azure;
  width: 60px;
  height: 60px;
  border-radius: 60px;
}
</style>
