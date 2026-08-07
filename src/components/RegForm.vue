<script setup>
import { suggestAddress } from '../service/dadataService.js';
import { reactive, watch, ref } from "vue";
import { useAuth } from "../stores/auth";
import { useLocations } from "../stores/locations"
import { useRouter } from "vue-router";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import BackButton from "./BackButton.vue";

import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import { message } from "ant-design-vue";
import axios from "axios";
import { redirectToVkAuth } from "../service/vkAuth";
const user = useAuth();

function regVk() {
  redirectToVkAuth("/");
}
const router = useRouter();
let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");
let formState = reactive({
  fullname: "",
  email: "",
  password: "",
  userLocation: null,
  consent: false
});
async function sendRegInfo() {
  let response = await user.registration({
    email: formState.email,
    password: formState.password,
    fullname: formState.fullname,
    userLocation: formState.userLocation
  });
  if (response.status == 200) {
    // update location from user loc
    useLocations().setLocation()

    message.config({ duration: 1.5, top: "70vh" });
    message.success({
      content: "Успешно!",
      onClose: () => {
        router.push("/");
      },
    });
  }
}

let locationSearchRequest = ref('')
let possibleLocations = ref([])
function selectStartLocation(selected) {
  for (let l of possibleLocations.value) {
    if (l.value == selected) {
      formState.userLocation = l.location
    }
  }
}
watch(locationSearchRequest, async (newValue, oldValue) => {
  if (newValue.trim().length > 2 && newValue.length > oldValue.length) {
    try {
      let suggestions = await suggestAddress(newValue, { toBound: "settlement" })
      possibleLocations.value = []
      for (let s of suggestions) {
        let location = {
          value: s.value,
          location: {
            name: s.value,
            shortName: '',
            type: 'Point',
            coordinates: [
              s.data.geo_lon,
              s.data.geo_lat
            ]
          }
        }

        if (s.data.settlement) {
          location.location.shortName = s.data.settlement
        }
        else if (s.data.city) {
          location.location.shortName = s.data.city
        } else {
          location.location.shortName = s.value
        }

        possibleLocations.value.push(location)
      }
    } catch (error) {
      console.log(error);
    }
  }
})

const formSchema = yup.object({
  email: yup.string("неверный формат").required("заполните поле").email('неверный формат'),
  password: yup.string("неверный формат").required("заполните поле").min(6, 'минимум 6 символов'),
  fullname: yup.string("неверный формат").required("заполните поле"),
  startLocation: yup.string("неверный формат").required("заполните поле"),
  consent: yup.boolean().oneOf([true], "необходимо дать согласие")
});

</script>
<template>
  <div>
    <BackButton />
    <img v-if="!sm" src="../assets/images/auth_left.webp" alt="not found" style="position: fixed; left: 0px; bottom: 0px;  width: 20%;" />

    <img v-if="!sm" src="../assets/images/auth_right.webp" alt="not found"
      style="position: fixed; right: 0px; bottom: 0px; width: 20% " />
    <a-row type="flex" justify="center">
      <a-col :span="24" :md="8" class="pa-16">
        <h2>Регистрация</h2>
        <a-row type="flex" justify="center">

          <a-col :span="24">
            <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="sendRegInfo()">
              <Field name="fullname" v-slot="{ value, handleChange }" v-model="formState.fullname">
                <a-input @change="handleChange" :value="value" placeholder="Иван Иванов" size="large"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="fullname" class="error-message" />
              </Transition>

              <Field name="email" type="email" v-slot="{ value, handleChange }" v-model="formState.email">
                <a-input @update:value="handleChange" :value="value" placeholder="email@email.com" size="large"
                  class="mt-8"></a-input>
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

              <Field name="startLocation" v-slot="{ value, handleChange }" v-model="locationSearchRequest">
                <a-auto-complete :value="value" @update:value="handleChange" size="large" style="width: 100%" class="mt-8"
                  :options="possibleLocations" placeholder="Город/поселок" @select="selectStartLocation">
                </a-auto-complete>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="startLocation" class="error-message" />
              </Transition>

              <Field name="consent" type="checkbox" :value="true" v-slot="{ handleChange, checked }" v-model="formState.consent">
                <a-checkbox :checked="checked" @change="handleChange" class="mt-16">
                  <span style="font-size: 13px; line-height: 1.4;">
                    Я даю согласие на обработку моих персональных данных в соответствии с
                    <router-link to="/personal-data-rules" style="color:#ff6600">порядку обработки и защиты персональных данных</router-link>
                    и ознакомлен(а) с
                    <router-link to="/privacy-policy" style="color:#ff6600">политикой обработки персональных данных</router-link>
                  </span>
                </a-checkbox>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="consent" class="error-message" />
              </Transition>

              <div class="d-flex justify-center">
                <a-button class="ma-16 lets_go_btn" type="primary" html-type="submit">Отправить</a-button>
              </div>
            </Form>
            <div class="d-flex justify-center">
              <a-button class="mb-16 vk-login-btn" size="large" @click="regVk">
                Продолжить с VK ID
              </a-button>
            </div>
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
