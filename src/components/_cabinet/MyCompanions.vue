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
  let comps = [];
  for (let id of companionIds) {
    const response = await companionStore.getById(id);
    comps.push(response.data.companionRequests);
  }

  console.log(comps);

  companions.value = comps
  return

  if (companionRequests.length) {
    for (let _id of companionRequests) {
      const { data } = await companionStore.getById(_id);
      if (data) {
        companions.value.push(data);
      }
    }
  }
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
      <b>Отклики:</b> Имя, возраст, пол, телефон
    </a-col>

    <a-divider />
  </a-row>
</template>
