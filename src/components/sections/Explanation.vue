<script setup>

import StartImage from "../_explanation/StartSvgImg.vue";

;
</script>
<template>
  <a-row style="background:#64bed8">
    <a-col :span="24">
      <div class="slogan" >Cоообщество гостеприимных территорий</div>
      <StartImage style="width: 100%"></StartImage>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>

.slogan{
  text-align: center;
  transform: translateY(120%);
  font-family: 'Caveat', cursive;
  font-size: clamp(0.875rem, -0.825rem + 6.8vw, 3rem);
  color: white;
  font-weight: 700;
  height: 0;


}


</style>
