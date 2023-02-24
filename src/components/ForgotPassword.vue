<script setup>
import { reactive } from "vue";
import BackButton from "./BackButton.vue";
import { useAuth } from "../stores/auth";

const userStore = useAuth();

let form = reactive({
  email: "",
});

async function resetPassword() {
  let res = await userStore.resetPassword(form.email);
}
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :span="24" :md="8" class="pa-16">
        <h2>Смена пароля</h2>
        <a-row type="flex" justify="center">
          <a-col :span="24"
            >email
            <a-input
              placeholder="email@gmail.com"
              size="large"
              v-model:value="form.email"
              required
            ></a-input>
            вам прийдёт письмо с инструкцией
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <a-button
              class="ma-16 lets_go_btn"
              type="primary"
              size="large"
              @click="resetPassword"
              >Отправить</a-button
            >
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<style lang="scss" scoped></style>
