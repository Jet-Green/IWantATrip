<script setup>
import { ref, onMounted } from "vue";
import { useCompanions } from "../../stores/companions";
import { useRouter } from "vue-router";


const router = useRouter();
const companionStore = useCompanions();


let chosenCompanion = ref();


function getPhoneNumber(number) {
  return `tel:${number}`;
}


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
  chosenCompanion.value = companionStore.currentCompanion.companionRequests
  
});
</script>

<template>
  <a-col :span="24" class="mb-8">
    <h3>Поиск попутчиков</h3>
    <a-breadcrumb>
      <!-- <a-breadcrumb-item @click="router.back()">Попутчики</a-breadcrumb-item> -->
      <a-breadcrumb-item @click="router.back()">{{ companionStore.currentCompanion.direction }}</a-breadcrumb-item>
      <a-breadcrumb-item>Отклики</a-breadcrumb-item>
    </a-breadcrumb>
  </a-col>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :xl="6" v-for="request in chosenCompanion">
        <a-card class="pa-8" hoverable>
          <span class="mdi mdi-human-cane"></span>{{ ageString(request?.age) }}
          <div :class="[request.gender == 'Male' ? 'male' : 'female']">
            <span
              :class="
                request.gender == 'Female'
                  ? 'mdi mdi-gender-female'
                  : request.gender == 'Male'
                  ? 'mdi mdi-gender-male'
                  : 'mdi mdi-human-male-female'
              "
            ></span
            >{{
              request.gender == "Male"
                ? "Мужчина"
                : request.gender == "Female"
                ? "Женщина"
                : "Не важно"
            }}
          </div>
          <div>{{ request.name }} {{ request.surname }}</div>

          <div>
            <a :href="getPhoneNumber(request.phone)">
              <span class="mdi mdi-phone"></span> {{ request.phone }}</a
            >
          </div>
        </a-card>
      </a-col>
    </a-row>

</template>
