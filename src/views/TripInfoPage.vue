<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import FindTrip from "../components/sections/FindTrip.vue";
import BackButton from "../components/BackButton.vue";
const route = useRoute();

const _id = route.query._id;

// let response = computed(async () => {
//   let res = await axios.get(`http://localhost:3030/trips/get-by-id?_id=${_id}`)
//   console.log(res);

//   return res.data
// })
const backRoute = "/trips";
let trip = ref({});
axios
  .get(`http://localhost:3030/trips/get-by-id?_id=${_id}`)
  .then((response) => {
    trip.value = response.data;
    console.log(trip.value);
  })
  .catch((error) => {
    console.log(error);
  });
const clearData = (dataString) => {
  const dataFromString = new Date(dataString);
  return dataFromString.toLocaleDateString();
};
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />

    <a-row v-if="!trip._id">
      <a-col :span="24" class="d-flex justify-center">
        <a-spin size="large"></a-spin>
      </a-col>
    </a-row>

    <a-row v-else display="flex" justify="center" :gutter="[16, 16]" style="font-size: clamp(14px,2.5vw,16px)">
      <a-col :xs="24" :lg="24" class="title">
        <h1>{{ trip.name }}</h1>
      </a-col>
      <!-- добавить карусель фотографий -->
      <a-col :xs="24" :lg="8">
          <img
            :src="trip.images[0]"
            alt=""
            srcset=""
          />
      </a-col>
      <a-col :xs="22" :lg="8" class="content">
        <a-row display="flex">
          <a-col :xs="22" :lg="16" class="description">
            <span v-html="trip.offer"></span>
          </a-col>

          <a-col
            :xs="22"
            :lg="16"
            class="time"
            style="display: flex; flex-direction: column"
          >
            <span style="display: flex; flex-wrap: nowrap"
              >Продолжительность:
              <p class="ml-8 mb-4">
                <b>{{ trip.duration }} дней</b>
              </p>
            </span>
            <span style="display: flex; flex-wrap: nowrap"
              >Ближайший выезд:
              <p class="ml-8 mb-4">
                <b>{{ clearData(trip.start) }}</b>
              </p>
            </span>
          </a-col>

          <a-col :xs="22" :lg="16" class="people">
            Количество человек:
            <a-progress
              :percent="(trip.fromAge / 27) * 100"
              :format="(percent) => `20 ч.`"
            >
            </a-progress>
          </a-col>

          <!-- НЕ ПОНЯТНО ЧТО ЭТО И ОТУДА ДАННЫЕ -->
          <!-- <a-col :span="24" >
            <a-button type="primary" ghost shape="round" class="ma-8"
              >25 - 33 чел. + Сувенир</a-button
            >
            <a-button type="primary" ghost shape="round" class="ma-8"
              >34 - 34 чел. + Ужин</a-button
            >
          </a-col> -->

          <a-col :span="24"
            >Цена:
            <span v-for="(item, index) in trip.cost" :key="index" class="cost">
              {{ item.first }} : {{ item.price }} руб.,
            </span>
          </a-col>

          <a-col :xs="22" :lg="16" class="actions">
            <a-button
              type="primary"
              class="lets_go_btn"
              size="large"
              style="display: flex; justify-content: center"
            >
              Купить
            </a-button>
          </a-col>
        </a-row>
        
      </a-col>
      <a-col :xs="22" :lg="16">
        <span v-html="trip.description"></span>
      </a-col>
    </a-row>
  </div>
</template>
<style lang="scss" scoped>
.custom-card {
  margin: 8px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  .cover {
    object-fit: contain;
    display: flex;
    justify-content: center;
    background-color: #c4c4c4;
  }
}

img {
  width: 100%;
  aspect-ratio: 1/1;
}
.coster:nth-of-type(1n + 2) {
  display: flex;
}

.ant-row > .ant-col {
  margin-bottom: 8px;
}
.title {
  display: flex;
  justify-content: center;
}
</style>
