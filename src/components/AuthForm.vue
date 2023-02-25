<script setup>
import { ref } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter } from "vue-router";
import BackButton from "../components/BackButton.vue";
import { message } from "ant-design-vue";

import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

const user = useAuth();
const router = useRouter();
let email = ref(null);
let password = ref(null);

async function logIn() {
  console.log(email.value, password.value);
  return
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

const formSchema = yup.object({
  email: yup.string().required("заполните поле").email('неверный формат'),
  password: yup.string().required("заполните поле").min(6, 'минимум 6 символов'),
});

</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :span="24" :md="8" class="pa-16">
        <a-row>
          <a-col :span="24">
            <h2>Вход</h2>
            <Form :validation-schema="formSchema" v-slot="{ meta }">
              <Field name="email" type="email" v-slot="{ field, handleChange }">
                <a-input @change="handleChange" :value="field.value" placeholder="email@email.com" size="large"
                  v-model:value="email"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="email" class="error-message" />
              </Transition>

              <Field name="password" type="password" v-slot="{ field, handleChange }">
                <a-input @change="handleChange" :value="field.value" placeholder="Введите пароль" size="large"
                  v-model:value="password" type="password" class="mt-8"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="password" class="error-message" />
              </Transition>

              <div class="d-flex justify-center">
                <a-button :disabled="!meta.valid" class="ma-16 lets_go_btn" type="primary" size="large"
                  @submit="logIn()">Войти</a-button>
              </div>
            </Form>
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
<style scoped lang="scss">
.error-message {
  color: red;
}
</style>