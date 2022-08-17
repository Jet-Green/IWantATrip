<script setup>
import { reactive } from "vue";

const formState = reactive({
  image: '',
  name: '',
  phone: '',
  socialMedia: '',
  description: ''
});

</script>

<template>
  <a-form :model="formState" name="basic">
    <a-form-item label="Название" name="name" :rules="[{ required: true, message: 'Введите название!' }]">
      <a-input v-model:value="formState.name" />
    </a-form-item>

    <a-form-item label="Фотография" name="photo"
      :rules="[{ required: true, message: 'Введите ссылку на фотографию!' }]">
      <a-input v-model:value="formState.image" />
    </a-form-item>

    <a-form-item label="Описание" name="description" :rules="[{ required: true, message: 'Введите описание!' }]">
      <a-textarea placeholder="Описание" :rows="4" />
    </a-form-item>

    <a-form-item label="Телефон" name="phone" :rules="[{ required: true, message: 'Введите телефон!' }]">
      <a-input v-model:value="formState.phone" />
    </a-form-item>

    <a-form-item label="Соц. сети" name="socialMedia" :rules="[{ required: true, message: 'Введите ссылку!' }]">
      <a-input v-model:value="formState.socialMedia" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary">Отправить</a-button>
    </a-form-item>
  </a-form>
</template>
