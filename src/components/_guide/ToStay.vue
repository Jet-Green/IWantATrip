<script setup>
import BackButton from "../BackButton.vue";

import { useRouter } from 'vue-router';
import { useGuide } from "../../stores/guide";
import { onMounted } from "vue";

const router = useRouter()
const useGuideStore = useGuide();
const backRoute = { name: 'Landing', hash: '#guide' };

useGuideStore.fetchElementsByQuery('watch');
onMounted(() => {
  let recaptchaScript = document.createElement('script')
  recaptchaScript.setAttribute('src', 'https://hotels.gorodaivesi.ru/static/dist/js/affiliate-search.js')
  document.head.appendChild(recaptchaScript)
})
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h2>
          Поиск гостиниц
        </h2>
      </a-col>
    </a-row>
    <a-row class="mt-16" type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <link rel="stylesheet" href="//hotels.gorodaivesi.ru/static/dist/css/affiliate-search.css" />
        <div id="affiliate-search" data-lang="ru" data-domain="//hotels.gorodaivesi.ru" data-color="#ff6413" data-object-id="" data-object-label=""></div>
      </a-col>
    </a-row>
  </div>
</template>
<style></style>
