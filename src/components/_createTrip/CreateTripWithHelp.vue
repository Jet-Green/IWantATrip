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
});

let formState = reactive({
  email: "",
  password: "",
});
</script>
<template>
  <a-row type="flex" justify="center">
    <a-col :xs="22" :lg="16">
      <a-row :gutter="[16, 16]">
        <a-col :span="24">
          <h2>Заказать тур</h2>
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
          Продолжительность
          <p style="line-height: 40px">{{ form.duration }} дн.</p>
        </a-col>

        <a-col :xs="24" :md="12"
          >Направление
          <a-input
            placeholder="Байкал"
            size="large"
            v-model:value="form.location"
          ></a-input>
        </a-col>

        <a-col :span="24">
          Количество человек
          <a-col :span="12">
            <a-form-item label="Взрослые">
              <a-input v-model:value="form.desc" />
            </a-form-item>
            <!-- </a-col>
          <a-col :span="12"> -->
            <a-form-item label="Дети">
              <a-input v-model:value="form.desc" />
            </a-form-item>
          </a-col>
        </a-col>

        <a-col :span="12" style="display: flex; flex-direction: column">
          Описание программы
          <a-form-item>
            <a-input type="textarea" />
          </a-form-item>
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

        <a-col :span="12">
          <a-form-item
            label="E-mail"
            name="e-mail"
            :rules="[{ required: true, message: 'Введите e-mail!' }]"
          >
            <a-input v-model:value="formState.email" />
          </a-form-item>

          <a-form-item
            label="телефон"
            name="phone"
          >
            <a-input v-model:value="formState.phone" />
          </a-form-item>
        </a-col>

        <a-col :span="12"> </a-col>
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
</template>
<style></style>
