<script setup>
import { reactive } from 'vue';
const formState = reactive({
  username: '',
  email: '',
  password: '',
});
</script>
<template>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ xs: 2, sm: 5 }"
    :wrapper-col="{ xs: 16, sm: 18 }"
  >
    <a-form-item
      label="Ф.И.О"
      name="username"
      :rules="[{ required: true, message: 'Введите Ф.И.О!' }]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="E-mail"
      name="e-mail"
      :rules="[{ required: true, message: 'Введите e-mail!' }]"
    >
      <a-input v-model:value="formState.email" />
    </a-form-item>

    <a-form-item
      label="Пароль"
      name="password"
      :rules="[{ required: true, message: 'Введите пароль!' }]"
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>
    <a-form-item>
      <a-button key="submit" html-type="submit">Зарегистрироваться</a-button>
    </a-form-item>
  </a-form>
</template>