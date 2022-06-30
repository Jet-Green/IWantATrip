<script setup>
import { ref } from "vue";
import { useElementBounding } from "@vueuse/core";
const el = ref(null);
const { x, y, top, right, bottom, left, width, height } =
  useElementBounding(el);

console.dir(el);
 
</script>

<template>
  <div class="section" ref="el">
    <div class="section__item">Item 1</div>
    <div class="section__item">Item 2</div>
    <div class="section__item">Item 3</div>
    <div class="section__item">Item 4</div>
    <div class="section__item">Item 5</div>
  </div>
</template>
<style>
.section {
  display: flex;
  gap: 10px;
  max-width: 100px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  -webkit-overflow-scrolling: auto;
  scroll-padding: 1rem;
  padding: 1rem;
}

.section__item {
  display: flex;
  justify-content: center;

  flex: 0 0 100%;

  scroll-snap-align: start;

  font-size: 1.5rem;
  cursor: pointer;
}

/* Other styles */

body {
  font-family: "Arial";
  padding: 1rem;
  background-color: #f7f7f7;
}

.bg-1 {
  background-color: #f1c2c6;
}

.bg-2 {
  background-color: #dac2f1;
}

.bg-3 {
  background-color: #ccf1c2;
}

.bg-4 {
  background-color: #c2e9f1;
}

.bg-5 {
  background-color: #f1ebc2;
}
</style>