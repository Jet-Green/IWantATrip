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
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <p>Что посмотреть</p>

        <a-modal
          v-model:visible="visibleModal"
          title="Добавление"
          @ok="handleOk"
        >
          <AddGuideElement />
        </a-modal>
        <a-button type="" @click="showModal">Добавить</a-button>
      </a-col>
    </a-row>
  </div>
</template>
 