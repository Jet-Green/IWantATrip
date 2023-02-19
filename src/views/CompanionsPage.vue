<script setup>
import { useRouter } from "vue-router";
import { useCompanions } from "../stores/companions";
import BackButton from "../components/BackButton.vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const companionStore = useCompanions();
let router = useRouter();
let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");
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
};// это гениально
</script>
<template>
  <div>
    <BackButton />

    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="12">
        <h2>Ищу попутчика</h2>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center">
      <a-col class="d-flex justify-center">
        <a-button
          class="lets_go_btn mb-4"
          type="primary"
          size="large"
          @click="router.push('/add-companion')"
          >Добавить себя</a-button
        >
      </a-col>
    </a-row>
    <a-row class="d-flex justify-center">
      <a-col :lg="16" :xs="22">
        <a-row :gutter="[8, 8]">
          <a-col
            :lg="8"
         
            :sm="12"
            :xs="24"
            v-for="(companion, i) in companionStore.companions"
            :key="i"
          >
            <a-card class="card">
              <div>
                <span class="mdi mdi-human-male-female"></span
                >{{ companion.name }} <span class="mdi mdi-human-cane"></span
                >{{ ageString(companion.age) }}
              </div>
          
              <div>
                <span class="mdi mdi-compass-outline"></span
                >{{ companion.direction }}
              </div>
              <div :class="[companion.gender == 'Male' ? 'male' : 'female']">
                <span class="mdi mdi-gender-male-female"></span
                >{{ companion.gender == "Male" ? "Мужчину" : "Женщину" }}
              </div>
              <div>
                <span class="mdi mdi-calendar-arrow-right"></span>
                {{ `c ${clearData(companion.start)}` }} <span class="mdi mdi-calendar-arrow-left"></span
                >{{ `по ${clearData(companion.end)}` }}
              </div>
           
              <div>
                <span class="mdi mdi-list-status"></span
                >{{ companion.description }}
              </div>
              <a-tooltip placement="bottom">
                <template #title>
                  <span>отклик</span>
                </template>
                <a-button shape="circle" class="accept">
                  <span class="mdi mdi-thumb-up-outline"></span>
                </a-button>
              </a-tooltip>
            </a-card>
          </a-col>
        </a-row>
      </a-col>

      <!-- <a-col :xs="22" :lg="16">
        <a-row class="table_header">
          <a-col :xs="4" :md="3">имя</a-col>
          <a-col :xs="4" :md="2">возраст</a-col>
          <a-col :xs="12" :md="5">направление</a-col>
          <a-col :xs="4" :md="3">попутчик</a-col>
          <a-divider v-if="sm" class="ma-0"></a-divider>
          <a-col :xs="4" :md="2">начало</a-col>
          <a-col :xs="4" :md="2">конец</a-col>
          <a-col :xs="12" :md="5">пожелания</a-col>
          <a-col :xs="4" :md="2">отклик</a-col>
        </a-row>
        <a-row v-for="(companion, i) in companionStore.companions" :key="i"
          :class="companion.gender == 'Male' ? 'men' : 'women'" class="mt-4 pa-8" style="text-align:center">
          <a-col :xs="4" :md="3">{{ companion.name }}</a-col>
          <a-col :xs="4" :md="2">{{ ageString(companion.age) }}</a-col>
          <a-col :xs="12" :md="5">{{ companion.direction }}</a-col>
          <a-col :xs="4" :md="3">{{ companion.gender == "Male" ? "муж" : "жен" }}</a-col>
          <a-divider v-if="sm" class="ma-0"></a-divider>
          <a-col :xs="4" :md="2">{{ clearData(companion.start) }}</a-col>
          <a-col :xs="4" :md="2">{{ clearData(companion.end) }}</a-col>
          <a-col :xs="12" :md="5">{{ companion.description }}</a-col>
          <a-col :xs="4" :md="2">
            <a-button shape="circle" class="ma-16" 
              @click="router.push({ path: '/add-feedback', query: { id: companion._id }})">
              <span class="mdi mdi-thumb-up-outline"></span>
            </a-button></a-col>
        </a-row>
      </a-col> -->
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

.table_header {
  text-align: center;
  // background: rgba(34, 176, 214, 0.05) ;
}
.card {
  width: 100%;
  background: #f6f6f6;
  padding: 8px;
  position: relative;
  .mdi {
    margin: 4px;
  }
  .accept {
    position: absolute;
    top: -6px;
    right: -6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .male {
    color: rgba(34, 176, 214);
  }
  .female {
    color: rgb(255, 102, 0);
  }
}
</style>

