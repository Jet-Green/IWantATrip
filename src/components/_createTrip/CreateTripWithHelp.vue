<script setup>
import { reactive, ref } from "vue";

const dateFormatList = ["DD.MM.YYYY", "DD.MM.YY"];

let phoneNumber = ref("");
let form = reactive({
  duration: "",
  name: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
  fromAge: "",
  days: "",
});

let formState = reactive({
  email: "",
  password: "",
  username: "",
});

const value2 = ref([3, 20]);
</script>
<template>
  <form action="POST" enctype="multipart/form-data">
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-row :gutter="[16, 16]">
          <a-col :span="24">
            <h2>Заказать тур</h2>
          </a-col>
          <a-col :span="12">
            Тип тура
            <a-select
              style="width: 100%"
              placeholder="Тип тура"
              size="large"
              class="selector"
            >
              <a-select-option value="1"> Любой </a-select-option>
              <a-select-option value="2"> Пляжный </a-select-option>
              <a-select-option value="3"> Школьный </a-select-option>
              <a-select-option value="4"> Экскурсионный </a-select-option>
              <a-select-option value="5"> Активный </a-select-option>
              <a-select-option value="6"> Оздоровление </a-select-option>
              <a-select-option value="7"> Круизы </a-select-option>
            </a-select>
          </a-col>

          <a-col :xs="24" :md="12"
            >Направление
            <a-input
              placeholder="Байкал"
              size="large"
              v-model:value="form.location"
            ></a-input>
          </a-col>

          <a-col :span="12">
            Дата начала
            <a-date-picker
              v-model:value="start"
              style="width: 100%"
              placeholder="Начало"
              :locale="ruLocale"
              :format="dateFormatList"
            />
          </a-col>
          <a-col :span="12">
            Дата конца
            <a-date-picker
              v-model:value="end"
              style="width: 100%"
              placeholder="Конец"
              :locale="ruLocale"
              :format="dateFormatList"
            />
          </a-col>

          <a-col :span="12">
            Количество дней в туре
            <a-input-number
              id="inputNumber"
              v-model:value="form.days"
              style="width: 100%"
              placeholder="10"
            />
          </a-col>

          <a-col :span="6">
            Взрослые
            <a-input v-model:value="form.desc" />
          </a-col>
          <a-col :span="6">
            Дети
            <a-input v-model:value="form.desc" />
          </a-col>

          <a-col :span="24" style="display: flex; flex-direction: column">
            Описание программы

            <a-input type="textarea" />
          </a-col>

          <a-col :span="12">
            ФИО
            <a-input v-model:value="formState.username" />
          </a-col>
          <a-col :span="12">
            Телефон
            <a-input v-model:value="formState.phone" />
          </a-col>
          <a-col :span="12">
            E-mail
            <a-input v-model:value="formState.email" />
          </a-col>

          <a-col :xs="24" :md="12"
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

          <a-col>
            <a-checkbox v-model:checked="checked">Согласие на ОПД</a-checkbox>
          </a-col>

          <a-col :span="12"> </a-col>
        </a-row>

        <a-row type="flex" justify="center">
          <a-col :xs="24" :md="16" :lg="10" class="d-flex justify-center">
            <a-button class="mt-16" type="primary" shape="round" size="large"
              >Отправить заявку</a-button
            >
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </form>
</template>
<style></style>
