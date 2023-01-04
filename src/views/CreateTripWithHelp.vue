<script setup>
import BackButton from "../components/BackButton.vue"
import UserFullInfo from '../components/forms/UserFullInfo.vue'

import { reactive, ref } from "vue";
import typeOfTrip from "../fakeDB/tripType";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";

import TripService from "../service/TripService";
import { useAuth } from '../stores/auth'

const dateFormatList = ["DD.MM.YYYY", "DD.MM.YY"];
const monthFormatList = ["MM.YY"];
const ruLocale = locale;

const userStore = useAuth()

let form = reactive({
  duration: "",
  name: "",
  delivery: false,
  type: [],
  start: "",
  end: "",
  resource: "",
  desc: "",
  fromAge: "",
  phoneNumber: "",
  tripType: "Любой",
});

let formState = reactive({
  email: "",
  password: "",
  username: "",
});

function submit() {
  let toSend = Object.assign(form)
  toSend.start = new Date(form.start).getTime()  
  toSend.end = new Date(form.end).getTime()  
  
return TripService.bookingTrip(toSend)
  // очистить форму, сделать редирект на главную, вывести уведомление снизу об успехе
}


</script>
<template>
  <div>
    <BackButton />

    <form action="POST" @submit.prevent="submit" enctype="multipart/form-data" ref="newGuideElementForm">
      <a-row type="flex" justify="center">
        <a-col :xs="22" :lg="12">
          <a-row :gutter="[16, 16]">
            <a-col v-if="!userStore.user?.fullinfo" :span="24">
              <UserFullInfo />
            </a-col>
            <a-col :span="24">
              <h2>Заказать тур</h2>
              <div>
                Тип тура
                <a-select v-model:value="form.type" style="width: 100%" :options="typeOfTrip" mode="multiple">
                </a-select>
              </div>
            </a-col>

            <a-col :span="12">
              Дата начала
              <a-date-picker v-model:value="form.start" style="width: 100%" placeholder="Начало" :locale="ruLocale"
                :format="dateFormatList" />
            </a-col>
            <a-col :span="12">
              Дата конца
              <a-date-picker v-model:value="form.end" style="width: 100%" placeholder="Конец" :locale="ruLocale"
                :format="dateFormatList" />
            </a-col>

            <a-col :xs="24" :md="12">Направление
              <a-input placeholder="Байкал" size="large" v-model:value="form.location"></a-input>
            </a-col>
            <a-col :xs="24" :md="12">
              Продолжительность, дн.
              <a-input-number id="inputNumber" v-model:value="form.duration" style="width: 100%" placeholder="5"
                :min="1" />
            </a-col>

            <a-col :xs="24" :md="8">
              Взрослые
              <a-input-number :min="0" style="width: 100%" placeholder="2" />
            </a-col>
            <a-col :xs="24" :md="8">
              Дети
              <a-input-number :min="0" style="width: 100%" placeholder="1" />
            </a-col>
            <a-col :xs="24" :md="8">Мин. возраст, лет
              <a-input-number id="inputNumber" v-model:value="form.fromAge" style="width: 100%" placeholder="10"
                :min="0" :max="100" />
            </a-col>

            <a-col :xs="24">
              Пожелания

              <a-textarea autoSize />

            </a-col>
            <a-col :xs="24" :md="12">
              Телефон
              <a-input />
            </a-col>

            <a-col :xs="24" :md="12">
              E-mail
              <a-input />
            </a-col>
          </a-row>

          <a-row type="flex" justify="center">
            <a-col :xs="24" :md="16" :lg="10" class="d-flex justify-center">
              <a-button type="primary" html-type="submit" class="lets_go_btn mt-8" size="large">Отправить</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </form>
  </div>
</template>