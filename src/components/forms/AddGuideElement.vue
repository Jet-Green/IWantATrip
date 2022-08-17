<script setup>
import { reactive } from "vue";

const formState = reactive({
  photo: '',
  name: '',
  address: '',
  telephone: '',
  remember: true,
});

</script>

<template>
  <a-form :model="formState" name="basic">
    <a-form-item label="Название" name="name" :rules="[{ required: true, message: 'Введите название!' }]">
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item label="Фотография" name="photo"
      :rules="[{ required: true, message: 'Введите ссылку на фотографию!' }]">
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item label="Описание" name="description" :rules="[{ required: true, message: 'Введите описание!' }]">
      <a-textarea placeholder="Описание" :rows="4" />
    </a-form-item>

    <a-form-item label="Телефон" name="telephone" :rules="[{ required: true, message: 'Введите телефон!' }]">
      <a-input v-model:value="formState.password" />
    </a-form-item>

    <a-form-item label="Соц. сети" name="socialMedia" :rules="[{ required: true, message: 'Введите ссылку!' }]">
      <a-input v-model:value="formState.password" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary">Отправить</a-button>
    </a-form-item>
  </a-form>
</template>
