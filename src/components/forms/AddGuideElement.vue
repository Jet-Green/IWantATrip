<script setup>
import {  reactive } from "vue";

const formState = reactive({
      photo: '',
      name: '',
      address: '',
      telephone: '',
      remember: true,
    });

</script>

<template>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"

  >
    <a-form-item
      label="Фотография"
      name="photo"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="Название"
      name="name"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="Адрес"
      name="address"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item
      label="Телефон"
      name="telephone"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" >Submit</a-button>
    </a-form-item>
  </a-form>
</template>
