<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "../../stores/auth";
import { useCompanions } from "../../stores/companions";
import dayjs from "dayjs";
const userStore = useAuth();
const companionStore = useCompanions();

let companions = ref([]);
const companionRequests = userStore.user.companionRequests;
// const clearData = (dataString) => {
//   const dataFromString = new Date(dataString);
//   return dataFromString.toLocaleDateString();
// };
onMounted(async () => {
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
      <b>Время:</b> с {{ dayjs.unix(companion.start / 1000).format("DD.MM.YYYY") }} по
      {{ dayjs.unix(companion.end / 1000).format("DD.MM.YYYY") }} <br />
      <b>Направление: </b> {{ companion.direction }} <br />
    </a-col>
    <a-col :xs="24" :md="12"> 
    <b>Отклики:</b> Имя, возраст, пол, телефон </a-col>

    <a-divider />
  </a-row>
</template>
