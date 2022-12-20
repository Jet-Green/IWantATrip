<script setup>
import { useRouter } from "vue-router";
import { useCompanions } from "../stores/companions";
import BackButton from "../components/BackButton.vue";

const companionStore = useCompanions();
let router = useRouter();

const columns = [
  {
    title: "Имя",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Возраст",
    dataIndex: "age",
    key: "age",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Пол",
    dataIndex: "gender",
    key: "gender",
    filters: [
      {
        text: "муж",
        value: "Male",
      },
      {
        text: "жен",
        value: "Female",
      },
    ],
    filterMultiple: false,
    onFilter: (value, record) => record.gender.indexOf(value) === 0,
  },
  {
    title: "Направление",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Начало",
    dataIndex: "start",
    key: "start",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Конец",
    dataIndex: "end",
    key: "end",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Пожелания",
    dataIndex: "description",
    key: "description",
  },
];

const clearData = (dataString) => {
  const dataFromString = new Date(dataString);
  return dataFromString.toLocaleDateString();
};
const ageString = (age) => {
  if (age >= 10 && age <= 20) {
    return `${age} лет`;
  }
  let arr = age.split("");
  let lastNumber = arr[arr.length - 1];
  if (lastNumber == 1) {
    return `${age} год`;
  }
  if (lastNumber == 2 || lastNumber == 3 || lastNumber == 4) {
    return `${age} года`;
  }
  return `${age} лет`;
};
</script>
<template>
  <div>
    <BackButton></BackButton>

    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>Ищу попутчика</h2>
        <a-row type="flex" justify="center">
          <a-col class="d-flex justify-center">
            <a-button
              class="lets_go_btn ma-16"
              type="primary"
              size="large"
              @click="router.push('/add-companion')"
              >Добавить себя</a-button
            >
          </a-col>
        </a-row></a-col
      >

      <a-col :xs="22" :lg="16">
        <a-table :dataSource="companionStore.companions" :columns="columns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'gender'">
              {{ record.gender == "Male" ? "муж" : "жен" }}
            </template>
            <template v-if="column.key === 'start'">
              {{ clearData(record.start) }}
            </template>
            <template v-if="column.key === 'end'">
              {{ clearData(record.end) }}
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
.women {
  background: rgba(255, 102, 0, 0.05);
}
.men {
  background: rgba(34, 176, 214, 0.05);
}
</style>

<!-- <a-row
v-for="(companion, i) in companionStore.companions"
:key="i"
:class="companion.gender == 'Male' ? 'men' : 'women'"
class="ma-4 pa-8"
>
<a-col :xs="22"
  >Меня зовут <b>{{ companion.name }}</b>, мне
  <b>{{ ageString(companion.age) }}</b> . Ищу в попутчики
  {{ companion.gender == "Male" ? "мужчину" : "женщину" }} для поезки
  на(в) направление с {{ clearData(companion.start) }} по
  {{ clearData(companion.end) }}.

  <br />
  {{
    ` Предпочитаю ${companion.type
      .join(", ")
      .toLowerCase()} тип отдыха. Комментарии: ${
      companion.description
    }`
  }}</a-col
>
<a-col :xs="2" class="d-flex justify-center align-center">
  <a-button shape="circle">
    <span class="mdi mdi-thumb-up-outline"></span>
  </a-button>
</a-col>

</a-row> -->