<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import BackButton from "../components/BackButton.vue";
const route = useRoute();

const _id = route.query._id;

const backRoute = "/watch";

let company = ref({});

axios
  .get(`http://localhost:3030/guide/get-by-id?_id=${_id}`)
  .then((response) => {
    company.value = response.data;
    console.log(company.value);
  })
  .catch((error) => {
    console.log(error);
  });
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />

    <a-row v-if="!company._id">
      <a-col :span="24" class="d-flex justify-center">
        <a-spin size="large"></a-spin>
      </a-col>
    </a-row>

    <a-row v-else display="flex" justify="center" :gutter="[16, 16]">
      <a-col :xs="24" :lg="24" class="title">
        <h1>{{ company.name }}</h1>
      </a-col>

      <a-col :xs="22" :md="6" :lg="5">
        <a-row display="flex">
          <img :src="company.image" alt="" srcset="" />
        </a-row>
      </a-col>
      <a-col :xs="22" :md="12" :lg="10" class="content">
        <a-col :xs="22" class="description">
          <h3>{{ company.description }}</h3>
        </a-col>

        <a-col
          :xs="22"
          :md="16"
          :lg="16"
          class="time"
          style="display: flex; flex-direction: column"
        >
          <span>Адрес: {{ company.address }}</span>
          <span>Телефон: {{ company.phone }}</span>
          <span>Социальные сети: {{ company.socialMedia }}</span>
        </a-col>
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
  border-radius: 5px;
}

.title {
  display: flex;
  justify-content: center;
}
</style>
