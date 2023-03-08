<script setup>
import { reactive } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter } from "vue-router";
import BackButton from "./BackButton.vue";

import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import { message } from "ant-design-vue";
import axios from "axios";

const user = useAuth();
const router = useRouter();
let formState = reactive({
  fullname: "",
  email: "",
  password: "",
});
async function sendRegInfo() {
  let result = await user.registration({
    email: formState.email,
    password: formState.password,
    fullname: formState.fullname,
  });
  if (result.success) {
    try {
      axios.post(`http://localhost:4089/add-companion?name=${res.data.name}`);
    } catch (error) { }
    formState.fullname = "";
    formState.email = "";
    formState.password = "";
    message.config({ duration: 1.5, top: "70vh" });
    message.success({
      content: "Успешно!",
      onClose: () => {
        router.push("/");
      },
    });
  }
}

const formSchema = yup.object({
  email: yup.string("неверный формат").required("заполните поле").email('неверный формат'),
  password: yup.string("неверный формат").required("заполните поле").min(6, 'минимум 6 символов'),
  fullname: yup.string("неверный формат").required("заполните поле")
});
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :span="24" :md="8" class="pa-16">
        <h2>Регистрация</h2>
        <a-row type="flex" justify="center">

          <a-col :span="24">
            <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="sendRegInfo()">
              <Field name="fullname" v-slot="{ field, handleChange }">
                <a-input @change="handleChange" :value="field.value" v-model:value="formState.fullname"
                  placeholder="Иван Иванов" size="large"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="fullname" class="error-message" />
              </Transition>

              <Field name="email" type="email" v-slot="{ field, handleChange }">
                <a-input @change="handleChange" :value="field.value" placeholder="email@email.com" size="large"
                  v-model:value="formState.email" class="mt-8"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="email" class="error-message" />
              </Transition>

              <Field name="password" type="password" v-slot="{ field, handleChange }">
                <a-input @change="handleChange" :value="field.value" placeholder="Введите пароль" size="large"
                  v-model:value="formState.password" type="password" class="mt-8"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="password" class="error-message" />
              </Transition>

              <div class="d-flex justify-center">
                <a-button :disabled="!meta.valid" class="ma-16 lets_go_btn" type="primary" size="large"
                  html-type="submit">Отправить</a-button>
              </div>
            </Form>
          </a-col>

          <a-col :span="24" class="d-flex justify-center">
            <router-link to="/auth">войти</router-link>
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <router-link to="/forgot-password">забыли пароль?</router-link>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped lang="scss">
.error-message {
  color: red;
  font-size: clamp(0.625rem, 0.4261rem + 0.5682vw, 0.875rem);
}
</style>