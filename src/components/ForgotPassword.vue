<script setup>
import { reactive } from "vue";
import BackButton from "./BackButton.vue";
import { useAuth } from "../stores/auth";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const userStore = useAuth();

let form = reactive({
  email: "",
  password: "",
});

async function forgotPassword() {
  let res = await userStore.forgotPassword(form.email);
  form.email = "";
  router.push("/cabinet");
}

async function resetPassword() {
  let { query } = route;
  await userStore.resetPassword(form.password, query.token, query.user_id);
  router.push("/cabinet");
}
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :span="24" :md="8" class="pa-16">
        <h2>Смена пароля</h2>
        <a-row
          type="flex"
          justify="center"
          v-if="!route.query.user_id && !route.query.token"
        >
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
          
              @click="forgotPassword"
              >Отправить</a-button
            >
          </a-col>
        </a-row>
        <a-row type="flex" justify="center" v-else>
          <a-col :span="24"
            >пароль
            <a-input
              size="large"
              v-model:value="form.password"
              required
              type="password"
            ></a-input>
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <a-button
              class="ma-16 lets_go_btn"
              type="primary"
           
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
