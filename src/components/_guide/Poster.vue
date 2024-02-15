<script setup>
import BackButton from "../BackButton.vue";


</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <h2 >
          Афиши
          <!-- <a href="https://plpo.ru" target="_blank">
            <img src="../../assets/plpo.webp" alt="" srcset="" style="max-height: 50px;"></a> -->
        </h2>
      </a-col>
    </a-row>
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <iframe title="Афиши" style="width: 100%; height:90dvh; border: none" src="https://plpo.ru/frame">
        </iframe>
      </a-col>
    </a-row>


  </div>
</template>
