<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "../../stores/auth";
import { useCompanions } from "../../stores/companions";

const userStore = useAuth();
const companionStore = useCompanions();
const companionIds = userStore.user?.createdCompanions;

let companions = ref();

const clearData = (dataString) => {
  const dataFromString = new Date(dataString);
  return dataFromString.toLocaleDateString();
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
    <a-col :xs="24" :md="12">
      <b>Описание:</b> {{ companion.description }} <br />
      <b>Время:</b> с {{ clearData(companion.start) }} по
      {{ clearData(companion.end) }} <br />
      <b>Направление: </b> {{ companion.direction }} <br />
    </a-col>
    <a-col :xs="24" :md="12">
      <b>Отклики:</b>
      <a-col
        v-for="request in companion.companionRequests"
        :key="request.name"
        :md="24"
      >
        {{ request.name }} {{ request.surname }} {{ request.age }} лет
        {{ request.gender }} {{ request.phone }}
      </a-col>
    </a-col>
  </a-row>
  <a-divider />
</template>
