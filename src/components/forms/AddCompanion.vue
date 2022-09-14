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
  <form
    action="POST"
    @submit.prevent="submit"
    enctype="multipart/form-data"
    ref="newGuideElementForm"
  >
    <a-row class="mb-16" type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h1>Найти попутчика</h1>
        <a-col :span="12">
          <label>Имя</label>
          <a-input v-model:value="formState.name" />
        </a-col>

        <a-col :span="12">
          <label>Фамилия</label>
          <a-input v-model:value="formState.surname" />
        </a-col>

        <a-col :span="12">
          <label>Электронная почта</label>
          <a-input v-model:value="formState.email" />
        </a-col>

        <a-col :span="12">
          <label>Телефон</label>
          <a-input v-model:value="formState.phone" />
        </a-col>

        <a-col :span="12">
          <label>Возраст</label>
          <a-input type="number" v-model:value="formState.age" />
        </a-col>

        <a-col :span="12">
          <label>Пол</label>
          <a-radio-group v-model:value="formState.gender" name="radioGroup">
            <a-radio :value="'Male'">Мужчина</a-radio>
            <a-radio :value="'Female'">Женщина</a-radio>
          </a-radio-group>
        </a-col>

        <a-col :span="2">
          <label>Дата поездки</label>
        </a-col>

        <a-col :span="11">
          <a-date-picker
            v-model:value="formState.datestart"
            placeholder="Начало"
            :locale="ruLocale"
            :format="dateFormatList"
            style="width: 100%"
          />
        </a-col>

        <a-col :span="11">
          <a-date-picker
            v-model:value="formState.dateend"
            placeholder="Конец"
            :locale="ruLocale"
            :format="dateFormatList"
            style="width: 100%"
          />
        </a-col>

        <a-col :span="24">
          <label class="mb-4">Пожелания</label>
          <a-textarea :rows="4" v-model:value="formState.description" />
        </a-col>

        <a-button
          type="primary"
          class="lets_go_btn"
          size="large"
          style="display: flex; justify-content: center"
          >Отправить
        </a-button>
      </a-col>
    </a-row>
  </form>
</template>
<style scoped></style>
