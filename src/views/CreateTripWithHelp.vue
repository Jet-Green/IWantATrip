<script setup>
import BackButton from "../components/BackButton.vue";
import UserFullInfo from "../components/forms/UserFullInfo.vue";

import { reactive, ref, onMounted } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";

import BookingService from "../service/BookingService";
import { useAuth } from "../stores/auth";
import { useAppState } from "../stores/appState";

const dateFormatList = ["DD.MM.YYYY", "DD.MM.YY"];
const monthFormatList = ["MM.YY"];
const ruLocale = locale;

const userStore = useAuth();
const appStore = useAppState();

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
let userInfo = reactive({
  fullname: "",
  phone: "",
});

let formState = reactive({
  email: "",
  password: "",
  username: "",
});

async function submit() {
  let toSend = Object.assign(form);
  toSend.start = new Date(form.start).getTime();
  toSend.end = new Date(form.end).getTime();

  await userStore
    .updateUser({
      email: userStore.user.email,
      fullinfo: userInfo,
    })
    .then((response) => {
      userStore.user = response.data;
    })
    .catch((err) => {
      console.log(err);
    });

  return TripService.bookingTrip(toSend);
  // очистить форму, сделать редирект на главную, вывести уведомление снизу об успехе
}

onMounted(() => {
  if (userStore.user.fullinfo) {
    userStore.user.fullinfo.fullname
      ? (userInfo.fullname = userStore.user.fullinfo.fullname)
      : (userInfo.fullname = "");
    userStore.user.fullinfo.phone
      ? (userInfo.phone = userStore.user.fullinfo.phone)
      : (userInfo.phone = "");
  }
});
</script>
<template>
  <div style="position: relative">
    <BackButton />
    
    <img src="../assets/images/бокл.png" style="position: absolute; left: 0px; bottom: 0px; font-size: large"/>
      
    <img src="../assets/images/бокп.png" style="position: absolute; right: 0px; bottom: 0px; font-size: large"/>

    <form
      action="POST"
      @submit.prevent="submit"
      enctype="multipart/form-data"
      ref="newGuideElementForm"
    >
      
      <a-row type="flex" justify="center">
        <a-col :xs="22" :lg="12">
          <h2>О вас</h2>
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12">
              Фaмилия Имя
              <a-input
                style="width: 100%"
                v-model:value="userInfo.fullname"
                placeholder="Иванов Иван Иванович"
              />
            </a-col>
            <a-col :span="24" :md="12">
              Телефон
              <a-input
                style="width: 100%"
                v-model:value="userInfo.phone"
                placeholder="79127528874"
              />
            </a-col>

            <a-col :span="24">
              <h2>Заказать тур</h2>
              <div>
                Тип тура
                <a-select v-model:value="form.type" style="width: 100%" mode="multiple">
                  <a-select-option
                    v-for="value in appStore.appState[0].tripType"
                    :value="value"
                    >{{ value }}</a-select-option
                  >
                </a-select>
              </div>
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

            <a-col :xs="24" :md="12"
              >Направление
              <a-input
                placeholder="Байкал"
                size="large"
                v-model:value="form.location"
              ></a-input>
            </a-col>
            <a-col :xs="24" :md="12">
              Продолжительность, дн.
              <a-input-number
                id="inputNumber"
                v-model:value="form.duration"
                style="width: 100%"
                placeholder="5"
                :min="1"
              />
            </a-col>

            <a-col :xs="24" :md="8">
              Взрослые
              <a-input-number :min="0" style="width: 100%" placeholder="2" />
            </a-col>
            <a-col :xs="24" :md="8">
              Дети
              <a-input-number :min="0" style="width: 100%" placeholder="1" />
            </a-col>
            <a-col :xs="24" :md="8"
              >Мин. возраст, лет
              <a-input-number
                id="inputNumber"
                v-model:value="form.fromAge"
                style="width: 100%"
                placeholder="10"
                :min="0"
                :max="100"
              />
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
              <a-button
                type="primary"
                html-type="submit"
                class="lets_go_btn mt-8"
                size="large"
                >Отправить</a-button
              >
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </form>
  </div>
</template>
