<script setup>
import { reactive, ref } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter } from "vue-router";
import BackButton from "./BackButton.vue";

import { message } from 'ant-design-vue';
import axios from "axios";

const user = useAuth();
const router = useRouter();
let formState = reactive({
  fullname: "",
  email: "",
  password: "",
});
async function sendRegInfo() {
  let result = await user.registration({ email: formState.email, password: formState.password, fullname: formState.fullname })
  if (result.success) {
    axios.post(`http://localhost:4089?_fullname=${formState.fullname}&_email=${formState.email}`)
    formState.fullname = ''
    formState.email = ''
    formState.password = ''
    message.config({ duration: 1.5, top: '70vh' })
    message.success({
      content: 'Успешно!', onClose: () => {
        router.push('/')
      }
    })
  }
};
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :span="24" :md="8" class="pa-16">
        <h2>Регистрация</h2>
        <a-row type="flex" justify="center">
          <a-col :span="24">Имя Фамилия
            <a-input placeholder="Иван Иванов" size="large" v-model:value="formState.fullname" required></a-input>
          </a-col>
          <a-col :span="24">E-mail
            <a-input placeholder="email@email.com" size="large" v-model:value="formState.email" required></a-input>
          </a-col>
          <a-col :span="24">Пароль
            <a-input placeholder="qwerty" size="large" v-model:value="formState.password" type="password" required>
            </a-input>
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <a-button class="ma-16 lets_go_btn" type="primary" size="large" @click="sendRegInfo()">Отправить</a-button>
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <router-link to="/auth">войти</router-link>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
