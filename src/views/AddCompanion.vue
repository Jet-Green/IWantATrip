<script setup>
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import BackButton from "../components/BackButton.vue";
import CompanionService from "../service/CompanionService";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useAuth } from "../stores/auth";
import { message } from "ant-design-vue";


import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");

let router = useRouter();
const userStore = useAuth();
const ruLocale = locale;
const backRoute = "/companions";
let date = ref(null)
const dateFormatList = ["DD.MM.YYYY", "DD.MM.YYYY"];
const form = reactive({
  name: "",
  surname: "",
  email: "",
  phone: "",
  start: "",
  end: "",
  age: "",
  companionGender: "Не важно",
  gender: "Мужчина",
  type: "Любой",
  direction: "",
  description: "",
});


function submit() {
  CompanionService.createCompanion(form).then((res) => {
    const _id = res.data._id;
    // axios.post(`http://localhost:4089/add-companion?name=${form.name}`)
    userStore
      .updateUser({
        email: userStore.user.email,
        $push: { createdCompanions: _id },
      })
      .then((response) => {
        userStore.user = response.data;
        message.config({ top: "90vh",duration: 2 });

        message.success({ content: "Попутчик добавлен!" }).then(() => {
          router.push('/companions')
          Object.assign(form, {
            name: "",
            surname: "",
            email: "",
            phone: "",
            start: "",
            end: "",
            age: "",
            gender: "Male",
            companionGender: "Не важно",
            // type: "Любой",
            direction: "",
            description: "",

          });
          date.value = null

        });
      })
      .catch((err) => {
        console.log(err);
      });
  });


}
watch(date, () => {
  if (date.value) {
    form.start = date ? Number(Date.parse(date.value[0].$d.toString())) : ""
    form.end = date ? Number(Date.parse(date.value[1].$d.toString())) : ""
  }

});


const formSchema = yup.object({
  age: yup.string().required("заполните поле"),
  name: yup.string().required("заполните поле"),
  surname: yup.string().required("заполните поле"),
  email: yup.string().required("заполните поле").email('неверный формат'),
  phone: yup.string().required("заполните поле"),
  date: yup.array().required("заполните поле"),
  // start: yup.string().required("заполните поле"),
  // end: yup.string().required("заполните поле"),
  // companionGender: yup.string().required("заполните поле"),
  // type: yup.string().required("заполните поле"),
  direction: yup.string().required("заполните поле"),
  description: yup.string().required("заполните поле"),
})
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
      <img v-if="!sm" src="../assets/images/companion_left.png" style="position: fixed; left: 0px; bottom: 0px;  width: 20%;" />

      <img v-if="!sm" src="../assets/images/companion_right.png" style="position: fixed; right: 0px; bottom: 0px; width: 20% " />  
    <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit">
      <a-row type="flex" justify="center">
        <a-col :xs="22" :lg="12">
          <h2>Найти попутчика</h2>
          <a-row :gutter="[8, 8]">
            <a-col :xs="12" class="d-flex align-center" style="flex-wrap: wrap">
              Мой пол
              <a-radio-group v-model:value="form.gender" name="radioGroup"
                style="width: -moz-available; width: -webkit-fill-available">
                <a-radio :value="'Мужчина'">Мужчина</a-radio>
                <a-radio :value="'Женщина'">Женщина</a-radio>
              </a-radio-group>
            </a-col>

            <a-col :span="12">
              <Field name="age" v-slot="{ value, handleChange }" v-model="form.age">
                <label>Мой возраст</label>
                <a-input @update:value="handleChange" :value="value" type="number" :min="0" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="age" class="error-message" />
              </Transition>
            </a-col>

            <a-col :xs="24" :md="12">
              <Field name="name" v-slot="{ value, handleChange }" v-model="form.name">
                <label>Имя</label>
                <a-input @update:value="handleChange" :value="value" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="name" class="error-message" />
              </Transition>
            </a-col>

            <a-col :xs="24" :md="12">
              <Field name="surname" v-slot="{ value, handleChange }" v-model="form.surname">
                <label>Фамилия</label>
                <a-input @update:value="handleChange" :value="value" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="surname" class="error-message" />
              </Transition>
            </a-col>


            <a-col :xs="24" :md="12">
              <Field name="phone" v-slot="{ value, handleChange }" v-model="form.phone">
                <label>Телефон</label>
                <a-input @update:value="handleChange" :value="value" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="phone" class="error-message" />
              </Transition>
            </a-col>
            <a-col :xs="24" :md="12">
              <Field name="email" v-slot="{ value, handleChange }" v-model="form.email">
                <label>Электронная почта</label>
                <a-input @update:value="handleChange" :value="value" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="email" class="error-message" />
              </Transition>
            </a-col>



            <a-col :xs="24" :md="12" class="d-flex align-center" style="flex-wrap: wrap">
              Пол попутчика
              <a-radio-group v-model:value="form.companionGender" name="radioGroup"
                style="width: -moz-available; width: -webkit-fill-available">
                <a-radio :value="'Мужчина'">Мужчина</a-radio>
                <a-radio :value="'Женщина'">Женщина</a-radio>
                <a-radio :value="'Не важно'">Не важно</a-radio>
              </a-radio-group>
            </a-col>

            <a-col :xs="24" :md="12">
              <Field name="date" v-slot="{ value, handleChange }" v-model="date">
                Период
                <a-range-picker @update:value="handleChange" :value="value" style="width: 100%" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="date" class="error-message" />
              </Transition>

              <!-- <a-date-picker v-model:value="form.start" style="width: 100%" placeholder="Начало" :locale="ruLocale":format="dateFormatList" />
                                                                          </a-col>
                                                                          <a-col :span="12">
                                                                            Дата конца
                                                                            <a-date-picker v-model:value="form.end" style="width: 100%" placeholder="Конец" :locale="ruLocale"
                                                                              :format="dateFormatList" /> 
                                                                      -->
            </a-col>
            <a-col :xs="24">
              <!-- Тип отдыха <a-select v-model:value="form.type" style="width: 100%" :options="typeOfTrip" mode="multiple"></a-select> -->
              <Field name="direction" v-slot="{ value, handleChange }" v-model="form.direction">
                <label>Направление</label>
                <a-input @update:value="handleChange" :value="value" show-count :maxlength="30" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="direction" class="error-message" />
              </Transition>
            </a-col>
            <a-col :xs="24">
              <Field name="description" v-slot="{ value, handleChange }" v-model="form.description">
                Пожелания
                <a-textarea @update:value="handleChange" :value="value" autoSizeshow-count :maxlength="60" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="description" class="error-message" />
              </Transition>
            </a-col>
            <div class="d-flex justify-center" style="width: 100%">
              <a-button :disabled="!meta.valid" type="primary" class="lets_go_btn" size="large"
                html-type="submit">Отправить
              </a-button>
            </div>
          </a-row>
        </a-col>
      </a-row>
    </form>
  </div>
</template>