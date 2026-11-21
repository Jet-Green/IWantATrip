<script setup>
import { reactive, computed, ref } from "vue"
import { useAuth } from "../stores/auth";
import { useLocations } from "../stores/locations"
import { useRouter, useRoute } from "vue-router";
import BackButton from "../components/BackButton.vue";
import { message } from "ant-design-vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { Form, Field, ErrorMessage } from 'vee-validate';
import $api from "../plugins/axios";
import * as yup from 'yup';
import { safeAuthRedirect } from "../service/authRedirect";
import { redirectToVkAuth } from "../service/vkAuth";

const user = useAuth();
const router = useRouter();
const route = useRoute();
const redirect = computed(() => safeAuthRedirect(route.query.redirect));
let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");

let formState = reactive({
  email: "",
  password: "",
});

async function logIn() {
  let result = await user.login(formState.email, formState.password);
  if (result.success) {
    message.config({ duration: 0.5, top: "70vh" });
    message.success("Успешно!");
    router.push(redirect.value);
  }
}

const federationLoading = ref(false);
const federationError = ref('');
async function logInRental() {
  if (federationLoading.value) return;
  federationLoading.value = true; federationError.value = '';
  try {
    const { data } = await $api.post('/auth/federation/start', { returnPath: redirect.value });
    const target = new URL(data.url);
    if (target.origin !== 'https://rent.gorodaivesi.ru' || target.pathname !== '/federation/authorize') throw new Error('Invalid destination');
    window.location.assign(target.href);
  } catch { federationError.value = 'Не удалось начать вход. Попробуйте ещё раз.'; federationLoading.value = false; }
}

function logInVk() {
  redirectToVkAuth(redirect.value);
}

const formSchema = yup.object({
  email: yup.string().required("заполните поле").email('неверный формат'),
  password: yup.string().required("заполните поле").min(6, 'минимум 6 символов'),
});

</script>
<template>
  <div>
    <BackButton />
    <img v-if="!sm" src="../assets/images/auth_left.webp" style="position: fixed; left: 0px; bottom: 0px;  width: 20%;" alt="not found"/>

    <img v-if="!sm" src="../assets/images/auth_right.webp" style="position: fixed; right: 0px; bottom: 0px; width: 20% " alt="not found"/>
    <a-row type="flex" justify="center">
      <a-col :span="24" :md="8" class="pa-16">
        <a-row>
          <a-col :span="24">
            <h2>Вход</h2>
            <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="logIn">
              <Field name="email" type="email" v-slot="{ value, handleChange }" v-model="formState.email">
                <a-input @update:value="handleChange" :value="value" placeholder="email@email.com" size="large"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="email" class="error-message" />
              </Transition>

              <Field name="password" type="password" v-slot="{ value, handleChange }" v-model="formState.password">
                <a-input-password @update:value="handleChange" :value="value" placeholder="Введите пароль" size="large"
                  type="password" class="mt-8"></a-input-password>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="password" class="error-message" />
              </Transition>

              <div class="d-flex justify-center">
                <a-button  class="ma-16 lets_go_btn" type="primary"
                  html-type="submit">Войти</a-button>
              </div>
            </Form>
            <div class="d-flex justify-center">
              <a-button class="mb-16 vk-login-btn" size="large" @click="logInVk">
                Войти через VK ID
              </a-button>
            </div>
            <div v-if="!redirect.startsWith('/federation/authorize')" class="federation-entry">
              <a-button class="federation-login-btn" size="large" :loading="federationLoading" :disabled="federationLoading" @click="logInRental">
                <img src="../assets/images/rental-mark.svg" alt="" width="30" height="30" />
                <span>Войти через Аренду инвентаря</span>
              </a-button>
              <p v-if="federationError" role="alert">{{ federationError }}</p>
            </div>
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <router-link :to="{ path: '/reg', query: redirect !== '/' ? { redirect } : {} }">регистрация</router-link>
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <router-link to="/forgot-password">забыли пароль?</router-link>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped>
.vk-login-btn {
  background-color: #0077ff;
  border-color: #0077ff;
  color: #fff;
  border-radius: 24px;
}

.vk-login-btn:hover {
  background-color: #0066db;
  border-color: #0066db;
  color: #fff;
}
</style>

<style scoped>
.federation-entry { margin: 0 auto 16px; max-width: 100%; text-align: center; }
.federation-login-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; height: auto; min-height: 48px; padding: 8px 12px; border-radius: 24px; white-space: normal; line-height: 1.35; }
.federation-login-btn img { flex-shrink: 0; }
.federation-entry p { margin-top: 8px; }
</style>
