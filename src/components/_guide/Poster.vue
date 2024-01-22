<script setup>
import { onMounted } from "vue";
import BackButton from "../BackButton.vue";
import { get } from "@vueuse/core";
const getIframe = async() => {
  let iframe = await document.getElementById('iframe');
    console.log(iframe)
    iframe.contentWindow.postMessage('message', '*');
}
onMounted(() => {
  getIframe()
})
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <h2 class="d-flex space-between">
          Афиши
          <a href="https://plpo.ru" target="_blank">
            <img src="../../assets/plpo.webp" alt="" srcset="" style="max-height: 50px;"></a>
        </h2>
      </a-col>
    </a-row>

    <iframe title="Афиши" style="width: 100%; height:90dvh; border: none" src="https://plpo.ru/posters" id="iframe">
    
    </iframe>


  </div>
</template>
