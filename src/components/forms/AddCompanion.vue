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


  
  <a-row class="mb-16" type="flex" justify="center">
    <a-col :xs="22" :lg="16">
      <h1>Найти попутчика</h1>

      <a-row class="mb-16" type="flex" justify="space-between">
        <a-col :span="12" class="nowrap">
          <label>Имя</label>
          <a-input class="input" v-model:value="formState.name" />
        </a-col>

        <a-col :span="11" class="nowrap">
          <label>Фамилия</label>
          <a-input class="input" v-model:value="formState.surname" />
        </a-col>
      </a-row>

      <a-row class="mb-16" type="flex" justify="space-between">
        <a-col :span="12" class="nowrap">
          <label>Электронная почта</label>
          <a-input class="input" v-model:value="formState.email" />
        </a-col>

        <a-col :span="11" class="nowrap">
          <label>Телефон</label>
          <a-input class="input" v-model:value="formState.phone" />
        </a-col>
      </a-row>

      <a-row class="mb-16" type="flex" justify="space-between">
        <a-col :span="12" class="nowrap">
          <label>Возраст</label>
          <a-input class="input" type="number" v-model:value="formState.age" />
        </a-col>

        <a-col :span="11" class="nowrap">
          <label>Пол</label>
          <a-radio-group
            v-model:value="formState.gender"
            name="radioGroup"
          >
            <a-radio :value="'Male'">Мужчина</a-radio>
            <a-radio :value="'Female'">Женщина</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>

      <a-row class="mb-16 nowrap">
        <label>Дата поездки</label>
        <a-col :span="12">
          Дата начала путешествия
          <a-date-picker
            v-model:value="formState.datestart"
            placeholder="Начало"
            :locale="ruLocale"
            :format="dateFormatList"
            class="input"
            style="display:flex;flex-wrap: nowrap;"
          />
        </a-col>
        <a-col :span="12">
          Дата окончания путешествия
          <a-date-picker
            v-model:value="formState.dateend"
            placeholder="Конец"
            :locale="ruLocale"
            :format="dateFormatList"
            class="input"
            style="display:flex;flex-wrap: nowrap;"
          />
        </a-col>
      </a-row>

      <a-row class="mb-16">
        <a-col :span="24" class="nowrap">
          <label>Пожелания</label>
          <a-textarea :rows="4" v-model:value="formState.description"/>
        </a-col>
      </a-row>

      <a-button
        type="primary"
        class="lets_go_btn"
        size="large"
        style="display: flex; justify-content: center"
        >Отправить
      </a-button>

    </a-col>
  </a-row>



</template>
<style scoped>
.nowrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
}
.input{
  width: 75%;
}
</style>
