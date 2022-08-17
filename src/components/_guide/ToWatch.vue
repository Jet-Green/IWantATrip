<script setup>
import { ref } from "vue";

import { useData } from "../../stores/data";

import BackButton from "../BackButton.vue";
import AddGuideElement from "../forms/AddGuideElement.vue";
import GuideCard from "../cards/GuideCard.vue"

const visibleModal = ref(false);
const useDataStore = useData()

let whereToGo = useDataStore.getWhereToGo;

const showModal = () => {
  visibleModal.value = !visibleModal.value;
};
</script>
<template>
  <BackButton />
  <a-row type="flex" justify="center">
    <a-col :xs="22" :lg="16">
      <h2>Что посмотреть</h2>
      <a-row>
        <a-col v-for="element in whereToGo" :lg="5" :xs="10" class="ma-16">
          <GuideCard :element="element" />
        </a-col>
      </a-row>
      <a-modal v-model:visible="visibleModal" title="Добавление" @ok="handleOk">
        <AddGuideElement />
      </a-modal>
      <a-button type="" @click="showModal">Добавить</a-button>
    </a-col>
  </a-row>
</template>
 