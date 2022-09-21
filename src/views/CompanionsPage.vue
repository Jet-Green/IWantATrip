<script setup>
import { useRouter } from "vue-router";
import BackButton from "../components/BackButton.vue";
let router = useRouter();
let companions = [
  {
    number: "1",
    gender: "Ж",
    age: 30,
    way: "Египет",
    date: "2022 Декабрь - 2023 Февраль",
    time: "10 - 11 дней",
  },
  {
    number: "2",
    gender: "М",
    age: 35,
    way: "Япония",
    date: "2022 Апрель - 2022 Май",
    time: "20 - 25 дней",
  },
  {
    number: "3",
    gender: "Ж",
    age: 25,
    way: "Франция",
    date: "2022 Сентябрь - 2022 Ноября",
    time: "7 дней",
  },
  {
    number: "4",
    gender: "М",
    age: 27,
    way: "Египет",
    date: "2022 Ноября - 2023 Январь",
    time: "10 дней",
  },
  {
    number: "5",
    gender: "Ж",
    age: 20,
    way: "Америка",
    date: "2023 Июнь - 2023 Августа",
    time: "30 - 31 день",
  },
  {
    number: "6",
    gender: "М",
    age: 35,
    way: "Япония",
    date: "2022 Апрель - 2022 Май",
    time: "20 - 25 дней",
  },
  {
    number: "7",
    gender: "Ж",
    age: 25,
    way: "Франция",
    date: "2022 Сентябрь - 2022 Ноября",
    time: "7 дней",
  },
  {
    number: "8",
    gender: "М",
    age: 27,
    way: "Египет",
    date: "2022 Ноября - 2023 Январь",
    time: "10 дней",
  },
];
let columnslg = [
  {
    title: "№",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "Пол",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Возраст",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Направление",
    dataIndex: "way",
    key: "way",
  },
  {
    title: "Период",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Длительность",
    dataIndex: "time",
    key: "time",
  },
];
let columnssm = [
  {
    title: "№",
    dataIndex: "number",
    key: "number",
  },
  {
    title: "Пол",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Возраст",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Направление",
    dataIndex: "way",
    key: "way",
  },
];
</script>
<template>
  <div>
    <BackButton></BackButton>
    
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h2>Поиск попутчиков</h2>
        <a-table
          :columns="columnslg"
          :data-source="companions"
          :pagination="false"
        >
          <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'number'">
              <a>{{ text }}</a>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center">
      <a-col class="d-flex justify-center">
        <a-button class="mt-16" type="primary" shape="round" size="large" @click="router.push('/add-companion')"
          >Добавить себя</a-button
        >
      </a-col>
    </a-row>
  </div>
</template>
