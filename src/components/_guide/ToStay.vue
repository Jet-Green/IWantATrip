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
  let url = 'https://cpa.ostrovok.ru/static/widget/scripts/e9061465c5e7db51e59c37ff9304d6ef.js'
  let ostrovok = document.createElement('script')
  ostrovok.setAttribute('src', url)
  document.body.appendChild(ostrovok)

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
      </a-col>
    </a-row>
  </div>
</template>
<style>
body {
  display: flex;
  flex-direction: column;
}


</style>
