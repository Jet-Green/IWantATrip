<script setup>
import { reactive, watch } from "vue";

import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller("md");
</script>
<template>
  <a-row>
    <a-col :span="24" style="height: 60vh">
      <div class="topImage">
        <div class="titleContainer">
          <h1>
            Удобная платформа<br />
            для путешествий!
          </h1>
        </div>

        <a-button style="border-radius: 15px; color: #245159" size="large">
          Поехали!
        </a-button>
      </div>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
h1 {
  text-align: center;
  font-size: clamp(14px, 5vw, 36px);
}
.topImage {
  background-image: url("../../assets/images/topImage.jpg");
  height: 100%;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .titleContainer {
    padding: 5px 15px 0px 15px;
    margin-bottom:15px;
    border-radius: 15px;
    background: rgba(0, 0, 0, 0.15);
    box-shadow: 0 0 15px 15px rgba(0, 0, 0, 0.15);
    h1 {
      color: white;
      line-height:36px;
    }
  }
}
</style>
