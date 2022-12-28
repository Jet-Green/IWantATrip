<script setup>
import BackButton from "../BackButton.vue";

import { useRouter } from 'vue-router';
import { useGuide } from "../../stores/guide";

const router = useRouter()
const useGuideStore = useGuide();

useGuideStore.fetchElementsByQuery('watch');
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <p>Гиды</p>
      </a-col>
      <a-col :xs="22" :lg="16">
        <a-button type="primary" class="lets_go_btn" size="large"
          @click="router.push(`/add-guide-element?type=${router.currentRoute.value.path.slice(1)}`)">Добавить
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>
