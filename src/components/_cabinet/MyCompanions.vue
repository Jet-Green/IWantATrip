<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "../../stores/auth";
import { useCompanions } from "../../stores/companions";

const userStore = useAuth();
const companionStore = useCompanions();
const companionIds = userStore.user?.createdCompanions;

let companions = ref();

const clearData = (dataString) => {
  return new Date(Number(dataString))
    .toLocaleDateString("ru-Ru", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })
    .replaceAll("/", ".");
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
onMounted(async () => {
  let createdCompanions = [];
  for (let id of companionIds) {
    const response = await companionStore.getById(id);
    createdCompanions.push(response.data);
  }
  console.log(createdCompanions);
  companions.value = createdCompanions;
});
</script>

<template>
  <a-row v-for="(companion, index) in companions" :key="index">
    <a-card class="card">
      <div>
        <span class="mdi mdi-human-male-female"></span>{{ companion?.name }} <span class="mdi mdi-human-cane"></span>{{
          ageString(companion?.age) }}
      </div>

      <div>
        <span class="mdi mdi-compass-outline"></span>{{ companion?.direction }}
      </div>
      <div :class="[
        companion?.companionGender == 'Мужчина'
          ? 'male'
          : companion.companionGender == 'Женщина'
            ? 'female'
            : 'not-matter',
      ]">
        <span :class="
          companion?.companionGender == 'Женщина'
            ? 'mdi mdi-gender-female'
            : companion?.companionGender == 'Мужчина'
              ? 'mdi mdi-gender-male'
              : 'mdi mdi-human-male-female'
        "></span>{{
  companion?.companionGender == "Мужчина"
  ? "Мужчину"
  : companion?.companionGender == "Женщина"
    ? "Женщину"
    : "Не важно"
}}
      </div>
      <div>
        <span class="mdi mdi-calendar-arrow-right"></span>
        {{ `c ${clearData(companion?.start)}` }}
        <span class="mdi mdi-calendar-arrow-left"></span>
        {{ `по ${clearData(companion?.end)}` }}
      </div>

      <div>
        <span class="mdi mdi-list-status"></span>{{ companion?.description }}
      </div>
      <a-tooltip placement="bottom">
        <template #title>
          <span>отклик</span>
        </template>
      </a-tooltip>
      <b>Отклики:</b>
      <a-col v-for="request in companion?.companionRequests" :key="request.name" :md="24">
        {{ request?.name }} {{ request?.surname }} {{ request?.age }} лет
        {{ request?.gender }} {{ request?.phone }}
      </a-col>
    </a-card>
  </a-row>
  <a-divider />
</template>
