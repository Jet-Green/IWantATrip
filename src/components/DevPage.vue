<script setup>
import { reactive, ref } from 'vue'
import TripService from "../service/TripService";
import AppService from '../service/AppService';
import axios from 'axios'
import { Field } from 'vee-validate';

let tripType = ref('')

const clearTripsDB = () => {
  TripService.clearTripsDB()
};
function deleteGuideEls() {
  axios.get(import.meta.env.VITE_API_URL + "/guide/clear")
}
function deleteAllCompanions() {
  axios.get(import.meta.env.VITE_API_URL + "/companion/clear")
}
function dropDatabase() {
  axios.get(import.meta.env.VITE_API_URL + "/app-state/drop")
}
function sendType() {
  if (tripType.value) {
    AppService.setTripType(tripType.value)
  }
}
// function getFromLocalStorage(){
//   console.log(JSON.parse(localStorage.getItem('user1')));
// }

</script>
<template>
  <div>
    <div class="d-flex align-center direction-column">
      <a-button type="primary" size="large" class="ma-16 lets_go_btn" @click="clearTripsDB()">
        Удалить все туры
      </a-button>
      <a-button type="primary" size="large" class="ma-16 lets_go_btn" @click="deleteGuideEls">
        Удалить элементы гида(watch)
      </a-button>
      <a-button type="primary" size="large" class="ma-16 lets_go_btn" @click="deleteAllCompanions">
        Удалить попутчиков
      </a-button>
      <a-button type="primary" size="large" class="ma-16 lets_go_btn" @click="dropDatabase">
        drop database
      </a-button>
      <!-- <a-button type="primary" size="large" class="ma-16 lets_go_btn" @click="getFromLocalStorage">
        вывести из localStorage
      </a-button> -->
    </div>
    <a-divider type="vertical" />

    <a-row class="d-flex justify-center">
      <a-col :xs="22" :md="16" class="d-flex align-center direction-column">
        <h3>Добавить тип тура</h3>
        <a-col :span="12">
          <a-input style="width: 100%" placeholder="Пляжный" v-model:value="tripType" />
          <div>
            <a-button type="primary"  class="ma-16 lets_go_btn" @click="sendType()">
              Отправить тип тура
            </a-button>
          </div>

        </a-col>
      </a-col>
    </a-row>
  </div>
</template>
<style lang="scss" scoped></style>