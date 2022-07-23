<script setup>
import { reactive } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller("md");

const cards = reactive([
  {
    title: "создай тур",
    image:
      "https://themiscochat.com/wp-content/uploads/2022/04/couple-relaxing-beach-vacation.webp",
  },
  {
    title: "выбери тур",
    image:
      "https://themiscochat.com/wp-content/uploads/2022/04/couple-relaxing-beach-vacation.webp",
  },
  {
    title: "попутчики",
    image:
      "https://themiscochat.com/wp-content/uploads/2022/04/couple-relaxing-beach-vacation.webp",
  },
  {
    title: "гид по городу",
    image:
      "https://themiscochat.com/wp-content/uploads/2022/04/couple-relaxing-beach-vacation.webp",
  },
]);
</script>
<template>
  <a-row type="flex" justify="center" class="mt-48">
    <a-col :xs="22" :lg="16" class="d-flex justify-center">
      <h1>Удобная платформа для путешествий!</h1>
    </a-col>
    <a-col :xs="22" :lg="16" style="display: flex; flex-wrap: wrap">
      <a-col v-for="(card, index) in cards" :key="index" :xs="12" :sm="12" :lg="6"
        :class="{ 'pa-4': sm, 'pa-16': !sm }">
        <img style="border-radius: 20px; width: 100%; aspect-ratio: 18/10" :src="card.image" />

        <p style="text-align: center">{{ card.title }}</p>
      </a-col>
    </a-col>
  </a-row>

</template>
<style lang="scss" scoped>
h1 {
  text-align: center;
  font-size: clamp(14px, 5vw, 36px);
}
</style>
