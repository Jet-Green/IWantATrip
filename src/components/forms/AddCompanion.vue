<script setup>
import { reactive } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import BackButton from "../BackButton.vue";
const ruLocale = locale;
const dateFormatList = ["DD.MM.YYYY", "DD.MM.YY"];
const formState = reactive({
  name: "",
  surname: "",
  email: "",
  phone: "",
  age: "",
  gender: "Male",
  datestart: "",
  dateend: "",
  days: "",
  description: "",
});
</script>

<template>
  <BackButton />
  <a-row type="flex" justify="center">
    <a-col :xs="22" :lg="16">
      <a-form name="basic" style="align-items: center">
        <h1>Найти попутчика</h1>
        <a-row type="flex" justify="space-between">
          <a-col :span="12">
            <a-form-item
              label="Имя"
              name="name"
              :rules="[{ required: true, message: 'Введите имя!' }]"
            >
              <a-input v-model:value="formState.name" />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item
              label="Фамилия"
              name="surname"
              :rules="[{ required: true, message: 'Введите фамилию!' }]"
            >
              <a-input v-model:value="formState.surname" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-between">
          <a-col :span="12">
            <a-form-item
              label="Электронная почта"
              name="email"
              :rules="[{ required: true, message: 'Введите электроннную почту!' }]"
            >
              <a-input v-model:value="formState.email" />
            </a-form-item>
          </a-col>

          <a-col :span="11">
            <a-form-item
              label="Телефон"
              name="phone"
              :rules="[{ required: true, message: 'Введите телефон!' }]"
            >
              <a-input v-model:value="formState.phone" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-between">
          <a-col :span="12">
            <a-form-item
              label="Возраст"
              name="age"
              :rules="[{ required: true, message: 'Введите свой возраст!' }]"
            >
              <a-input type="number" v-model:value="formState.age" />
            </a-form-item>
          </a-col>

          <a-col :span="11">
            <a-form-item
              label="Пол"
              name="gender"
              :rules="[{ required: true, message: 'Укажите свой пол!' }]"
            >
              <a-radio-group
                v-model:value="formState.gender"
                name="radioGroup"
                style="display: flex; justify-content: space-evenly"
              >
                <a-radio :value="'Male'">Мужчина</a-radio>
                <a-radio :value="'Female'">Женщина</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item
          label="Дата поездки"
          name="date"
          :rules="[{ required: true, message: 'Введите дату!' }]"
          style="display: flex; justify-content: space-between; align-items: center"
        >
          <a-row>
            <a-col :span="12">
              Дата начала путешествия
              <a-date-picker
                v-model:value="formState.datestart"
                placeholder="Начало"
                :locale="ruLocale"
                :format="dateFormatList"
                style="width: 99%"
              />
            </a-col>
            <a-col :span="12">
              Дата окончания путешествия
              <a-date-picker
                v-model:value="formState.dateend"
                placeholder="Конец"
                :locale="ruLocale"
                :format="dateFormatList"
                style="width: 99%"
              />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item
          label="Описание"
          name="description"
          :rules="[{ required: true, message: 'Введите описание!' }]"
        >
          <a-textarea placeholder="Описание" :rows="4" />
        </a-form-item>
        <a-button
          type="primary"
          class="lets_go_btn"
          size="large"
          style="display: flex; justify-content: center"
          >Отправить</a-button
        >
      </a-form>
    </a-col>
  </a-row>
</template>
<style scoped></style>
