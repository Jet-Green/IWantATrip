<script setup>
import { ref, computed } from "vue";

import { useGuide } from "../../stores/guide";

import BackButton from "../BackButton.vue";
import AddGuideElement from "../forms/AddGuideElement.vue";
import GuideCard from "../cards/GuideCard.vue";

const visibleModal = ref(false);
const useGuideStore = useGuide();


useGuideStore.fetchElementsByQuery('toWatch');

let toWatch = computed(() => useGuideStore.toWatch)

const showModal = () => {
  visibleModal.value = !visibleModal.value;
};
</script>
<template>
  <div>
    <BackButton />

    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h2>Что посмотреть</h2>

        <a-row v-if="toWatch.length">
          <a-col v-for="element in toWatch" :lg="5" :xs="10" class="ma-16">
            <GuideCard :element="element" />
          </a-col>
        </a-row>
        <a-row v-else>
          <a-col :span="24" class="d-flex justify-center align-center">
            <a-spin size="large"></a-spin>
          </a-col>
        </a-row>

        <a-modal v-model:visible="visibleModal" title="Добавление" :footer="null">
          <AddGuideElement />
        </a-modal>

        <a-button type="" @click="showModal">Добавить</a-button>
      </a-col>
    </a-row>
  </div>
</template>
