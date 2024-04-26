<script setup>
import { useRouter } from "vue-router";
import BackButton from "../BackButton.vue";
// let loc_name = JSON.parse(localStorage.getItem("location")).name
let src = `https://plpo.ru/frame`
</script>
<template>
  <div>
    <BackButton />
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <h2>
          Афиши
          <!-- <a href="https://plpo.ru" target="_blank">
            <img src="../../assets/plpo.webp" alt="" srcset="" style="max-height: 50px;"></a> -->
        </h2>
      </a-col>
    </a-row>
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <iframe title="Афиши" style="width: 100%; height:90dvh; border: none" :src='src' id="iframe">

        </iframe>
      </a-col>
    </a-row>


  </div>
</template>
