<script setup>
import { reactive, ref, watch } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import BackButton from "../BackButton.vue";
import CompanionService from "../../service/CompanionService";
import { useAuth } from "../../stores/auth";
import { message } from "ant-design-vue";

import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

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
  let toSend = Object.assign(form)
  toSend.start = new Date(form.start).getTime()
  toSend.end = new Date(form.end).getTime()

  CompanionService.createCompanion(toSend).then((res) => {
    const _id = res.data._id;
    // axios.post(`http://localhost:4089/add-companion?name=${form.name}`)
    userStore
      .updateUser({
        email: userStore.user.email,
        $push: { createdCompanions: _id },
      })
      .then((response) => {
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
        userStore.user = response.data;
        message.config({ duration: 3, top: "90vh" });
        message.success({ content: "Попутчик добавлен!", onClose: close });
      })
      .catch((err) => {
        console.log(err);
      });
  });


}
watch(date, () => {
  form.start = date ? date.value[0].$d.getTime() : ""
  form.end = date ? date.value[1].$d.getTime() : ""
});


const formSchema = yup.object({
  age: yup.string().required("заполните поле"),
  name: yup.string().required("заполните поле"),
  surname: yup.string().required("заполните поле"),
  email: yup.string().required("заполните поле").email('неверный формат'),
  phone: yup.string().required("заполните поле"),
  // start: yup.string().required("заполните поле"),
  // end: yup.string().required("заполните поле"),
  // companionGender: yup.string().required("заполните поле"),
  // type: yup.string().required("заполните поле"),
  direction: yup.string().required("заполните поле"),
  description: yup.string().required("заполните поле"),
})
</script>
<template>
  <BackButton :backRoute="backRoute" />
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
            <Field name="age" v-slot="{ field, handleChange }">
              <label>Мой возраст</label>
              <a-input @change="handleChange" :value="field.value" type="number" :min="0" v-model:value="form.age" />
            </Field>
            <Transition name="fade">
              <ErrorMessage name="age" class="error-message" />
            </Transition>
          </a-col>

          <a-col :xs="24" :md="12">
            <Field name="name" v-slot="{ field, handleChange }">
              <label>Имя</label>
              <a-input @change="handleChange" :value="field.value" v-model:value="form.name" />
            </Field>
            <Transition name="fade">
              <ErrorMessage name="name" class="error-message" />
            </Transition>
          </a-col>

          <a-col :xs="24" :md="12">
            <Field name="surname" v-slot="{ field, handleChange }">
              <label>Фамилия</label>
              <a-input @change="handleChange" :value="field.value" v-model:value="form.surname" />
            </Field>
            <Transition name="fade">
              <ErrorMessage name="surname" class="error-message" />
            </Transition>
          </a-col>


          <a-col :xs="24" :md="12">
            <Field name="phone" v-slot="{ field, handleChange }">
              <label>Телефон</label>
              <a-input @change="handleChange" :value="field.value" v-model:value="form.phone" />
            </Field>
            <Transition name="fade">
              <ErrorMessage name="phone" class="error-message" />
            </Transition>
          </a-col>
          <a-col :xs="24" :md="12">
            <Field name="email" v-slot="{ field, handleChange }">
              <label>Электронная почта</label>
              <a-input @change="handleChange" :value="field.value" v-model:value="form.email" />
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

            Период
            <a-range-picker style="width:100%" v-model:value="date" />


            <!-- <a-date-picker v-model:value="form.start" style="width: 100%" placeholder="Начало" :locale="ruLocale"
                                                                                                                    :format="dateFormatList" />
                                                                                                                </a-col>
                                                                                                                <a-col :span="12">
                                                                                                                  Дата конца
                                                                                                                  <a-date-picker v-model:value="form.end" style="width: 100%" placeholder="Конец" :locale="ruLocale"
                                                                                                                    :format="dateFormatList" />
                                                                                                                -->
          </a-col>
          <a-col :xs="24">
            <!-- Тип отдыха <a-select v-model:value="form.type" style="width: 100%" :options="typeOfTrip" mode="multiple"></a-select> -->
            <Field name="direction" v-slot="{ field, handleChange }">
              <label>Направление</label>
              <a-input @change="handleChange" :value="field.value" v-model:value="form.direction" show-count
                :maxlength="30" />
            </Field>
            <Transition name="fade">
              <ErrorMessage name="direction" class="error-message" />
            </Transition>
          </a-col>
          <a-col :xs="24">
            <Field name="description" v-slot="{ field, handleChange }">
              Пожелания
              <a-textarea @change="handleChange" :value="field.value" autoSize v-model:value="form.description" show-count
                :maxlength="60" />
            </Field>
            <Transition name="fade">
              <ErrorMessage name="description" class="error-message" />
            </Transition>
          </a-col>
          <div class="d-flex justify-center" style="width: 100%">
            <a-button :disabled="!meta.valid" type="primary" class="lets_go_btn" size="large" html-type="submit">Отправить
            </a-button>
          </div>
        </a-row>
      </a-col>
    </a-row>
  </form>
</template>
<style scoped lang="scss">
.error-message {
  color: red;
  font-size: clamp(0.625rem, 0.4261rem + 0.5682vw, 0.875rem);
}
</style>
