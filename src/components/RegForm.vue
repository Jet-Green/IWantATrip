<script setup>
import { reactive } from "vue";
const formState = reactive({
  username: "",
  email: "",
  password: "",
});
</script>
<template>
  <div
    :model="formState"
    name="basic"
    :label-col="{ xs: 2, sm: 5 }"
    :wrapper-col="{ xs: 16, sm: 18 }"
  >
    <a-select v-model:value="value1" style="width: 100%">
      <a-select-option value="jack"> Турист </a-select-option>
      <a-select-option value="lucy"> Создатель тура </a-select-option>
      <a-select-option value="disabled"> Владелец тур. объекта </a-select-option>
    </a-select>

    <!-- <a-form-item
      label="Ф.И.О"
      name="username"
      :rules="[{ required: true, message: 'Введите Ф.И.О!' }]"
    > -->
    Ф. И. О.
    <a-input v-model:value="formState.username" />
    <!-- </a-form-item> -->

    <!-- <a-form-item
      label="E-mail"
      name="e-mail"
      :rules="[{ required: true, message: 'Введите e-mail!' }]"
    > -->
    E-mail
    <a-input v-model:value="formState.email" />
    <!-- </a-form-item> -->

    <!-- <a-form-item
      label="Пароль"
      name="password"
      :rules="[{ required: true, message: 'Введите пароль!' }]"
    > -->
    Пароль
    <a-input-password v-model:value="formState.password" />
    <!-- </a-form-item> -->
    <a-form-item style="d.-flex">
      <a-button
        key="submit"
        html-type="submit"
        class="lets_go_btn mt-8"
        style="justify-center"
        >Зарегистрироваться</a-button
      >
    </a-form-item>
  </div>
</template>
