<script setup>
import { reactive, ref } from "vue";
import typeOfTrip from "../../fakeDB/tripType";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";

const dateFormatList = ["DD.MM.YYYY", "DD.MM.YY"];
const monthFormatList = ["MM.YY"];
const ruLocale = locale;

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
});
</script>
<template>
  <div>
  <a-row type="flex" justify="center">
    <a-col :xs="22" :lg="12">
      <a-row :gutter="[16, 16]">
        <a-col :span="24">
          <h2>Заказать тур</h2>
          <div>
            Тип тура
            <a-select
              v-model:value="form.type"
              style="width: 100%"
              :options="typeOfTrip"
              mode="multiple"
            ></a-select>
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
          <a-button class="mt-16" type="primary" shape="round" size="large"
            >Отправить</a-button
          >
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</div>
</template>
<style></style>
