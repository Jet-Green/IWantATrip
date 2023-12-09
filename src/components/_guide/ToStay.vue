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
        <h2>
          Поиск гостиниц
        </h2>
      </a-col>
      <a-col :xs="22" :lg="16">
      </a-col>
    </a-row>
  </div>
</template>
