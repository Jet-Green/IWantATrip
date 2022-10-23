<script setup>
import { reactive } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter } from "vue-router";
import BackButton from "./BackButton.vue";

const user = useAuth();
const router = useRouter();
const formState = reactive({
  username: "",
  email: "",
  password: "",
});

const sendRegInfo = () => {
  user.login()
  router.push("/")
};
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :span="24" :md="8" class="pa-16">
        <h2>Регистрация</h2>
        <a-row type="flex" justify="center">
          <a-col :span="24"
            >Имя Фамилия
            <a-input
              placeholder="Иван Иванов"
              size="large"
              v-model="formState.username"
              required
            ></a-input>
          </a-col>
          <a-col :span="24"
            >E-mail
            <a-input
              placeholder="email@email.com"
              size="large"
              v-model="formState.email"
              required
            ></a-input>
          </a-col>
          <a-col :span="24"
            >Пароль
            <a-input
              placeholder="qwerty"
              size="large"
              v-model="formState.password"
              type="password"
              required
            ></a-input>
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <a-button class="ma-16 lets_go_btn" type="primary" size="large" @click="sendRegInfo()"
              >Отправить</a-button
            >
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <router-link to="/auth">войти</router-link>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
