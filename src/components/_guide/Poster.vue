<script setup>
import BackButton from "../BackButton.vue";

import { useRouter } from 'vue-router';
import { useGuide } from "../../stores/guide";

import PosterService from "../../service/PosterService"
import { onMounted } from "vue";

onMounted(async () => {
  let response = await PosterService.getPosters()
  console.log(response)
})
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <p>Афиша</p>
      </a-col>
      <a-col :xs="22" :lg="16">
        <a-button type="primary" class="lets_go_btn" size="large"
          @click="router.push(`/add-guide-element?type=${router.currentRoute.value.path.slice(1)}`)">Добавить
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>
