<script setup>
import { ref, computed } from "vue";
import { useElementBounding } from "@vueuse/core";

const props = defineProps(["direction"]);
console.log(props.direction);

const el = ref(null);
const { x, y, top, right, bottom, left, width, height } =
  useElementBounding(el);

const activeMenuItem = () => {
  console.dir(el);
};
</script>

<template>
  <div class="section" ref="el">
    <div
      v-for="(item, index) in props.direction"
      :key="index"
      :id="index"
      class="section__item"
    >
      {{ item.menuItem }}
    </div>
  </div>
</template>
<style>
.section {
  display: flex;
  gap: 10px;
  max-width: 150px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: auto;
  
}
.section::-webkit-scrollbar {
  width: 0;
}
.section__item {
  display: flex;
  justify-content: center;
  color: white;


  flex: 0 0 100%;

  scroll-snap-align: start;

  font-size: 1.5rem;
  cursor: pointer;
}
</style>