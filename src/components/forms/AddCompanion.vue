<script setup>
import { ref, reactive, defineComponent } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
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
  <a-form :model="formState" name="basic">
    <a-form-item
      label="Имя"
      name="name"
      :rules="[{ required: true, message: 'Введите имя!' }]"
    >
      <a-input v-model:value="formState.name" />
    </a-form-item>

    <a-form-item
      label="Фамилия"
      name="surname"
      :rules="[{ required: true, message: 'Введите фамилию!' }]"
    >
      <a-input v-model:value="formState.surname" />
    </a-form-item>

    <a-form-item
      label="Электронная почта"
      name="email"
      :rules="[{ required: true, message: 'Введите электроннную почту!' }]"
    >
      <a-input v-model:value="formState.email" />
    </a-form-item>

    <a-form-item
      label="Телефон"
      name="phone"
      :rules="[{ required: true, message: 'Введите телефон!' }]"
    >
      <a-input v-model:value="formState.phone" />
    </a-form-item>

    <a-form-item
      label="Возраст"
      name="age"
      :rules="[{ required: true, message: 'Введите свой возраст!' }]"
    >
      <a-input type="number" v-model:value="formState.age" />
    </a-form-item>

    <a-form-item
      label="Дата"
      name="date"
      :rules="[{ required: true, message: 'Введите дату!' }]"
    >
      <a-col :span="12">
        Дата начала
        <a-date-picker
          v-model:value="formState.datestart"
          placeholder="Начало"
          :locale="ruLocale"
          :format="dateFormatList"
        />
      </a-col>
      <a-col :span="12">
        Дата конца
        <a-date-picker
          v-model:value="formState.dateend"
          placeholder="Конец"
          :locale="ruLocale"
          :format="dateFormatList"
        />
      </a-col>
    </a-form-item>

    <a-form-item
      label="Описание"
      name="description"
      :rules="[{ required: true, message: 'Введите описание!' }]"
    >
      <a-textarea placeholder="Описание" :rows="4" />
    </a-form-item>

    <a-form-item
      label="Пол"
      name="gender"
      :rules="[{ required: true, message: 'Укажите свой пол!' }]"
    >
      <a-radio v-model:checked="checked" :value="Male">Женщина</a-radio>
      <a-radio :value="Female">Мужчина</a-radio>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" class="lets_go_btn" size="large">Отправить</a-button>
    </a-form-item>
  </a-form>
</template>
