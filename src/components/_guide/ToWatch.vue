<script setup>
import { ref } from "vue";

import BackButton from "../BackButton.vue";
import AddGuideElement from "../forms/AddGuideElement.vue";

const visibleModal = ref(false);

const showModal = () => {
  visibleModal.value = !visibleModal.value;
};
</script>
<template>
  <BackButton />
  <a-row type="flex" justify="center">
    <a-col :xs="22" :lg="16">
      <p>Что посмотреть</p>

      <a-modal v-model:visible="visibleModal" title="Добавление">
        <AddGuideElement />
        <template #footer>
          <a-button class="lets_go_btn" type="primary" size="large" @click="visibleModal = false">ЗАКРЫТЬ</a-button>
        </template>
      </a-modal>
      <a-button type="" @click="showModal">Добавить</a-button>
    </a-col>
  </a-row>
</template>
 