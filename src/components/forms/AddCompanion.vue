<script setup>
import { reactive } from "vue";
import typeOfTrip from "../../fakeDB/tripType";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import BackButton from "../BackButton.vue";
import CompanionService from "../../service/CompanionService";
import { useAuth } from "../../stores/auth";
import { message } from "ant-design-vue";
import axios from 'axios'

const userStore = useAuth();
const ruLocale = locale;
const backRoute = "/companions";

const dateFormatList = ["DD.MM.YYYY", "DD.MM.YY"];
const form = reactive({
  name: "",
  surname: "",
  email: "",
  phone: "",
  start: "",
  end: "",
  age: "",
  gender: "Male",
  type: "Любой",
  description: "",
});
function submit() {
  let toSend = Object.assign(form)
  toSend.start = new Date(form.start).getTime()  
  toSend.end = new Date(form.end).getTime() 

  CompanionService.createCompanion(toSend).then((res) => {
    const _id = res.data._id;
    axios.post(`http://localhost:4089/add-companion?name=${form.name}`)
    userStore
      .updateUser({
        email: userStore.user.email,
        $push: { companionRequests: _id },
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
          // type: "Любой",
          direction: "",
          description: "",
        });
        userStore.user = response.data;
        message.config({ duration: 3, top: "90vh" });
        message.success({ content: "Попутчик добавлен!", onClose: close });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  
}
</script>

<template>
  <BackButton :backRoute="backRoute" />
  <form action="POST" @submit.prevent="submit" enctype="multipart/form-data">
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>Найти попутчика</h2>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="12">
            <label>Имя</label>
            <a-input v-model:value="form.name" />
          </a-col>

          <a-col :xs="24" :md="12">
            <label>Фамилия</label>
            <a-input v-model:value="form.surname" />
          </a-col>

          <a-col :xs="24" :md="12">
            <label>Телефон</label>
            <a-input v-model:value="form.phone" />
          </a-col>
          <a-col :xs="24" :md="12">
            <label>Электронная почта</label>
            <a-input v-model:value="form.email" />
          </a-col>

          <a-col :span="12">
            <label>Возраст</label>
            <a-input type="number" :min="0" v-model:value="form.age" />
          </a-col>

          <a-col :span="12" class="d-flex align-center" style="flex-wrap: wrap">
            Пол
            <a-radio-group
              v-model:value="form.gender"
              name="radioGroup"
              style="width: -moz-available; width: -webkit-fill-available"
            >
              <a-radio :value="'Male'">Мужчина</a-radio>
              <a-radio :value="'Female'">Женщина</a-radio>
            </a-radio-group>
          </a-col>

          <a-col :span="12">
            Дата начала
            <a-date-picker
              v-model:value="form.start"
              style="width: 100%"
              placeholder="Начало"
              :locale="ruLocale"
              :format="dateFormatList"
            />
          </a-col>
          <a-col :span="12">
            Дата конца
            <a-date-picker
              v-model:value="form.end"
              style="width: 100%"
              placeholder="Конец"
              :locale="ruLocale"
              :format="dateFormatList"
            />
          </a-col>
          <a-col :xs="24">
            <!-- Тип отдыха
            <a-select v-model:value="form.type" style="width: 100%" :options="typeOfTrip" mode="multiple"></a-select> -->
            <label>Направление</label>
            <a-input v-model:value="form.direction" show-count :maxlength="16" />
          </a-col>
          <a-col :xs="24">
            Пожелания
            <a-textarea autoSize v-model:value="form.description" show-count :maxlength="54" />
          </a-col>
          <div class="d-flex justify-center" style="width: 100%">
            <a-button
              type="primary"
              class="lets_go_btn"
              size="large"
              html-type="submit"
              >Отправить
            </a-button>
          </div>
        </a-row>
      </a-col>
    </a-row>
  </form>
</template>
<style scoped>
</style>
