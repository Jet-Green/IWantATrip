<script setup>
import { reactive } from "vue";
import { useAuth } from "../stores/auth";
import users from "../fakeDB/users";

let authStore = useAuth();

let formState = reactive({
  email: "",
  password: "",
});

const emit = defineEmits(["closeModal"]);

let currentUser = null;
function login() {
  for (let user of users) {
    if (user.email == formState.email && user.password == formState.password) {
      console.log("login");
      authStore.setUserStatus(user.userStatus);
      authStore.login();
    }
  }
}
</script>
<template>
  <div
    :model="formState"
    name="auth"
    :label-col="{ xs: 2, sm: 5 }"
    :wrapper-col="{ xs: 16, sm: 18 }"
    @submit="login"
  >
    <!-- <a-form-item label="E-mail" name="e-mail" :rules="[{ required: true, message: 'Введите e-mail!' }]"> -->
    E-mail
    <a-input v-model:value="formState.email" />
    <!-- </a-form-item> -->

    <!-- <a-form-item label="Пароль" name="password" :rules="[{ required: true, message: 'Введите пароль!' }]"> -->
    Пароль
    <a-input-password v-model:value="formState.password" />
    <!-- </a-form-item> -->
    <!-- <a-form-item> -->
      <a-button key="submit" html-type="submit" class="lets_go_btn mt-8">Войти</a-button>
    <!-- </a-form-item> -->
  </div>
</template>
