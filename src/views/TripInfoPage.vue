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
let duration = "12";
const backRoute = "/trips";
let tour = ref({});
let x = ref();
async function durationCounter(){
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(tour.value.start), 100)
  });
  let result = await promise; // будет ждать, пока промис не выполнится (*)
  const date1 = new Date('7/13/2010');
const date2 = new Date('12/15/2010');
const diffTime = Math.abs(date2 - date1);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

}
axios
  .get(`http://localhost:3030/trips/get-by-id?_id=${_id}`)
  .then((response) => {
    tour.value = response.data;
  })
  .catch((error) => {
    console.log(error);
  });
  tour.duration=durationCounter()
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />

    <a-row v-if="!tour._id">
      <a-col :span="24" class="d-flex justify-center">
        <a-spin size="large"></a-spin>
      </a-col>
    </a-row>

    <a-row v-else display="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-row display="flex" justify="space-around">
        
          <a-col :lg="11" :xs="24">
            <img :src="tour.image" alt="" srcset="" />
          </a-col>

          <a-col class="content" :lg="11" :xs="24">
            <div class="title">
              <h1>{{ x }}</h1>
            </div>

            <div class="description ml-16">
              <h3>{{ tour.description }}</h3>
            </div>

            <div class="time mb-8" style="display:flex;flex-direction: column;">
                <span  style="display:flex;flex-wrap: nowrap;">Продолжительность: <h3 class="ml-8 mb-4">{{ duration }} дней</h3>
                </span>
                <span  style="display:flex;flex-wrap: nowrap;">Ближайший выезд: <h3 class="ml-8 mb-4">{{ tour.start }}</h3>
                </span>
              </div>

            <div class="people ma-8">
              Количество человек:
              <a-progress
                :percent="(tour.fromAge / 27) * 100"
                :format="(percent) => `20 ч.`"
              >
              </a-progress>
            </div>

            <div class="prizes">
              <a-button type="primary" shape="round" class="prize mb-8 mr-8"
                >25 - 33 чел. + Сувенир</a-button
              >
              <a-button type="primary" shape="round" class="prize mb-8 mr-8"
                >34 - 34 чел. + Ужин</a-button
              >
            </div>

            <div>
              <div style="display:flex;flex-direction: column;" class="mt-16 mb-16">

                <span style="display:flex;flex-wrap: wrap;">Цена: <h3 class="ml-8 mb-8" style="width:80%" v-for="item in tour.cost" >
                  {{ item.name }} : {{ item.cost }}
                </h3>
                </span>
              </div>
            </div>
            <div class="actions">
              <a-button
                type="primary"
                class="lets_go_btn"
                size="large"
                style="display: flex; justify-content: center"
              >
                Купить
              </a-button>
            </div>
          </a-col>
        </a-row>
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
}
</style>
