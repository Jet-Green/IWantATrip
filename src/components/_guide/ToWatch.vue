<script setup>
import { computed } from "vue";
import { useRouter } from 'vue-router';

import { useGuide } from "../../stores/guide";

import BackButton from "../BackButton.vue";
import GuideCard from "../cards/GuideCard.vue";

const router = useRouter()
const useGuideStore = useGuide();

useGuideStore.fetchElementsByQuery('watch');

let watch = computed(() => useGuideStore.watch)
</script>
<template>
  <div>
    <BackButton />

    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h2>Что посмотреть</h2>

        <a-row v-if="watch.length" style="align-items: flex-end">
          <a-col v-for="element, index in watch" :key="index" :lg="5" :xs="10" class="ma-16">
            <GuideCard :element="element" />
          </a-col>
        </a-row>
        <a-row v-else>
          <a-col :span="24" class="d-flex justify-center align-center">
            <a-spin size="large"></a-spin>
          </a-col>
        </a-row>

        <a-button class="lets_go_btn" type="primary" large
          @click="router.push(`/add-guide-element?type=${router.currentRoute.value.path.slice(1)}`)">Добавить
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>
