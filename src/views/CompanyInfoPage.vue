<script setup>
  import { ref } from "vue";
  import { useRoute } from "vue-router"
  import axios from 'axios'

  import BackButton from "../components/BackButton.vue";
  const route = useRoute()
  
  const _id = route.query._id;
  
  const backRoute = "/watch"
  
  let watch = ref({})
  
  axios.get(`http://localhost:3030/guide/get-by-id?_id=${_id}`)
    .then((response) => {
      watch.value = response.data;
    })
    .catch((error) => {
      console.log(error)
    })
  </script>
<template>
  <BackButton :backRoute="backRoute" />

  <a-row display="flex" justify="center" class="mb-16">
    <a-col :xs="22" :lg="16">
      <div class="cover mb-16">
        <img :src="watch.image" alt="" srcset="" />
      </div>
       <div class="title mt-16">
        <h1>{{ watch.name }}</h1>
      </div>

      <div class="ml-16">
        <h3>{{ watch.description }}</h3>
      </div>
      <div style="display: flex; justify-content: flex-end; flex-direction: column">
        <span>Адрес: {{ watch.address }}</span>
        <span>Телефон: {{ watch.phone }}</span>
        <span>Социальные сети: {{ watch.socialMedia }}</span>
      </div>
    </a-col>
  </a-row>
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
  width: 50%;
  aspect-ratio: 1/1;
  border-radius: 25px;
}
</style>
