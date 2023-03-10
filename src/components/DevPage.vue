<script setup>
import TripService from "../service/TripService";
import axios from 'axios'
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
</script>
<template>
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
  </div>
  <a-divider type="vertical" />

  <a-row class="d-flex justify-center">
    <a-col :xs="22" :md="16" class="d-flex align-center direction-column">
      <h3>Добавить тип тура</h3>
      <a-col :span="12">
        <a-input style="width: 100%" placeholder="Gляжный" />
        <div>
          <a-button type="primary" size="large" class="ma-16 lets_go_btn">
            Отправить тип тура
          </a-button>
        </div>

      </a-col>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped></style>