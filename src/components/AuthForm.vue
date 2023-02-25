<script setup>
import { ref } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter } from "vue-router";
import BackButton from "../components/BackButton.vue";
import { message } from "ant-design-vue";

const user = useAuth();
const router = useRouter();
let email = ref(null);
let password = ref(null);

async function logIn() {
  let result = await user.login(email.value, password.value);
  if (result.success) {
    email.value = "";
    password.value = "";
    message.config({ duration: 1.5, top: "70vh" });
    message.success({
      content: "Успешно!",
      onClose: () => {
        router.push("/");
      },
    });
  }
}
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :span="24" :md="8" class="pa-16">
        <h2>Вход</h2>
        <a-row type="flex" justify="center">
          <a-col :span="24"
            >E-mail
            <a-input
              placeholder="email@email.com"
              size="large"
              v-model:value="email"
            ></a-input>
          </a-col>
          <a-col :span="24"
            >Пароль
            <a-input
              placeholder="Введите пароль"
              size="large"
              v-model:value="password"
              type="password"
            ></a-input>
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <a-button
              class="ma-16 lets_go_btn"
              type="primary"
              size="large"
              @click="logIn()"
              >Войти</a-button
            >
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <router-link to="/reg">регистрация</router-link>
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <router-link to="/forgot-password">забыли пароль?</router-link>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
