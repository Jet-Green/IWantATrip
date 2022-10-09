<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router"
import axios from 'axios'

import BackButton from "../components/BackButton.vue";
const route = useRoute()

const _id = route.query._id;

// let response = computed(async () => {
//   let res = await axios.get(`http://localhost:3030/trips/get-by-id?_id=${_id}`)
//   console.log(res);

//   return res.data
// })

const backRoute = "/trips"

let tour = ref({})

axios.get(`http://localhost:3030/trips/get-by-id?_id=${_id}`)
  .then((response) => {
    tour.value = response.data;
  })
  .catch((error) => {
    console.log(error)
  })
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
    <a-row v-if="!tour._id">
      <a-col :span="24" class="d-flex justify-center">
        <a-spin size="large"></a-spin>
      </a-col>
    </a-row>
    <a-row v-else display="flex" justify="center" class="mb-16">
      <a-col :xs="22" :lg="16">
        <a-row display="flex" justify="space-around">
          <a-col :lg="11" :xs="24">
            <div class="cover mb-16">
              <img :src="tour.image" alt="" srcset="" />
            </div>

            <div class="title mt-16">
              <h1>{{ tour.title }}</h1>
            </div>
          </a-col>

          <a-col class="content ma-8" :lg="11" :xs="24">
            <div class="people ma-8">
              Количество человек:
              <a-progress :percent="(tour.people / 27) * 100" :format="(percent) => `20 ч.`">
              </a-progress>
            </div>

            <div class="prizes">
              <a-button type="primary" shape="round" class="prize mb-8 mr-8">25 - 33 чел. + Сувенир</a-button>
              <a-button type="primary" shape="round" class="prize mb-8 mr-8">34 - 34 чел. + Ужин</a-button>
            </div>

            <div>
              <div class="time mb-8">
                <div>Продолжительность: {{ tour.duration }}</div>
                <div>Ближайший выезд: {{ tour.when }}</div>
              </div>

              <div class="price">Цена: {{ tour.price }}</div>
            </div>
            <div class="actions">
              <a-button type="text" class="mt-8 lets_go_btn"> Купить </a-button>
            </div>
          </a-col>
        </a-row>

        <div class="description ml-16">
          <h3>{{ tour.description }}</h3>
        </div>
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

  .prizes {
    .prize {
      font-size: 12px;
      color: #3daff5;
      background-color: white;
    }
  }
}

img {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 25px;
}
</style>
