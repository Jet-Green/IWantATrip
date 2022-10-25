<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import BackButton from "../components/BackButton.vue";
const route = useRoute();

const _id = route.query._id;

const backRoute = "/watch";

let watch = ref({});

axios
  .get(`http://localhost:3030/guide/get-by-id?_id=${_id}`)
  .then((response) => {
    watch.value = response.data;
    console.log(watch.value);
  })
  .catch((error) => {
    console.log(error);
  });
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />

    <a-row v-if="!watch._id">
      <a-col :span="24" class="d-flex justify-center">
        <a-spin size="large"></a-spin>
      </a-col>
    </a-row>

    <a-row v-else display="flex" justify="center" :gutter="[16, 16]">
      <a-col :xs="24" :lg="24" class="title">
        <h1>{{ watch.name }}</h1>
      </a-col>

      <a-col :xs="11" :lg="8">
        <a-row display="flex">
          <img
            :src="watch.image"
            alt=""
            srcset=""
          />
        </a-row>

      </a-col>
      <a-col :xs="11" :lg="8" class="content">
        <a-row display="flex"> 
          <a-col :xs="22" :lg="16" class="description">
            <span v-html="watch.address"></span>
          </a-col>
          <a-col :xs="22" :lg="16" class="description">
            <span v-html="watch.phone"></span>
          </a-col>
          <a-col :xs="22" :lg="16" class="description">
            <span v-html="watch.socialMedia"></span>
          </a-col>
          <a-col :xs="22" :lg="16" class="description">
            <span v-html="watch.description"></span>
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
.title {
  display: flex;
  justify-content: center;
}
.ant-row > .ant-col {
  margin-bottom: 8px;
}
</style>
