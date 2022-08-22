<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { watch, nextTick, ref } from "vue";

const quill = ref(null);
let newContent = "";
let description = ref(`ПРОГРАММА ТУРА
                    1. Камень "Дыроватый", карстовая арка "Царские ворота" и грот "Влюбленных"
                    2. Красный камень.
                    3. Развалины бывшей зоны политических заключенных "Створ" и камень "Печка"
                    4. Малые Глухие и Большие Глухие Камни.
                    5. Стоянка древнего человека.
                    6. Карстовая воронка с Голубым озером.
                    7. Камень "Гребешок".

                    1 день:
                    12:00 Отправление группы из Глазова
                    До 22:00 Дорога до поселка Усть-Койва
                    С 22:00 Разбивка лагеря, готовка ужина. Сон в палатках.

                    2 день:
                    07:00 Подъем.
                    7:00-8:30 Ранняя экскурсия на камень "Дыроватый", грот "Влюбленных" и карстовую арку "Царские ворота". По желанию можно остаться в лагере.
                    8:30-9:30 Завтрак.
                    9:30-11:00 Сбор лагеря, погрузка снаряжения на катамараны.
                    11:00-12:30 Сплав по Чусовой до камня Красный. Экскурсия на камень.
                    12:30-15:00 Продолжение сплава до района развалин бывшей зоны политических заключенных "Створ" и камень "Печка". Обед
                    15:00-18:00 Сплав до района «Больших Глухих камней».
                    С 19:00 Разбиваем лагерь, готовим ужин, а также готовим походную баню. Сон в палатках.

                    3 день:
                    08:00 Подъем.
                    08:00-9:00 Завтрак.
                    9:00-10:30 Сбор лагеря и погрузка снаряжения на катамараны.
                    10:30-12:00 Сплав по Чусовой. Обязательно совершаем экскурсию на гордость реки Чусовой -"Голубое озеро".
                    12:00-15:00 Продолжение сплава до города Чусовой.
                    15:00-17:00 Сдача инвентаря, погрузка снаряжения в автобус. Обед.
                    17:00 Отправление группы домой
                    01:00 (след. день) Ориентировочное время прибытия группы в Глазов
    `);
let form = ref({
  name: "Река: Чусовая",
  dates: "05 - 07 августа",
  time: "3 дня",
  tripRoute: "деревня Усть - Койва - город Чусовой.",
  distance: "от Перми - 360 км, сплав - 42 км",
  cost: "6950 р / взросл, 6700 р / дети и пенсионеры(входит в стоимость: из Глазова все переезды и тур по программе) Стоимость из г.Пермь - 5450 р / взросл, 5200 р / дети и пенсионеры.",
  offer:
    "Пожалуй, сплав - это один из самых прекрасных способов отдохнуть на природе, никуда не торопясь, насладиться живописными видами, послушать шум ветра, гуляющего по лесу, и плеск воды, бьющейся о корму Вашего судна.Проплывая по речной глади на катамаранах, Вы можете по достоинству оценить и полюбоваться на огромные камни - останцы, растущие в высь вдоль Чусовой.",
  description: description.value,
});

watch(description, (newValue) => {
  newContent = newValue;

  if (newContent === newValue) return;

  quill.value.setHTML(newValue);

  // Workaround https://github.com/vueup/vue-quill/issues/52
  // move cursor to end
  nextTick(() => {
    let q = quill.value.getQuill();
    q.setSelection(newValue.length, 0, "api");
    q.focus();
  });
});

function submit() {
  alert("создать");
  console.log(form.value.description);
}
</script>
<template>
  <a-row type="flex" justify="center">
    <a-col :xs="22" :lg="12">
      <h1>Создать тур</h1>
      <form action="POST" @submit.prevent="submit">
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            Название
            <a-input
              placeholder="Название тура"
              size="large"
              v-model:value="form.name"
            ></a-input>
          </a-col>
          <a-col :span="12">
            Даты
            <a-input
              placeholder="Даты"
              size="large"
              v-model:value="form.dates"
            ></a-input>
          </a-col>
          <a-col :span="12">
            Продолжительность
            <a-input
              placeholder="Продолжительность"
              size="large"
              v-model:value="form.time"
            ></a-input>
          </a-col>
          <a-col :span="12">
            Маршрут
            <a-input
              placeholder="Даты"
              size="large"
              v-model:value="form.tripRoute"
            ></a-input>
          </a-col>
          <a-col :span="24">
            Цены
            <a-textarea
              placeholder="Даты"
              size="large"
              v-model:value="form.cost"
              :autoSize="true"
            >
            </a-textarea>
          </a-col>
          <a-col :span="24">
            Реклама
            <a-textarea
              placeholder="Даты"
              size="large"
              v-model:value="form.offer"
              :autoSize="true"
            >
            </a-textarea>
          </a-col>
          <a-col :span="24" style="display: flex; flex-direction: column">
            Описание программы
            <QuillEditor
              theme="snow"
              style="min-height: 200px"
              ref="quill"
              v-model:content="form.description"
              contentType="html"
              :toolbar="[
                [{ header: [1, 2] }],
                ['bold', 'italic', 'underline'],
                [{ color: ['#000000', '#ff6600', '#3daff5'] }],
                [{ align: [] }],
              ]"
            />
            <!-- <a-textarea placeholder="Даты" size="large" v-model:value="form.description" :autoSize="true">
                        </a-textarea> -->
          </a-col>
          <a-col :span="24">
            <a-button
              class="mt-16"
              type="primary"
              shape="round"
              size="large"
              html-type="submit"
              >Отправить
            </a-button>
          </a-col>
        </a-row>
      </form>
    </a-col>
  </a-row>
</template>