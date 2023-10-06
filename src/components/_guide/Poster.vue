<script setup>
import BackButton from "../BackButton.vue";

import PosterService from "../../service/PosterService"
import { onMounted, ref } from "vue";
import axios from "axios";

let posters = ref()
const backRoute = { name: 'Landing', hash: '#guide' };

onMounted(async () => {
  let response = await axios.post('https://plpo.ru/api/get-all', {}, {
    headers: {
      "Authorization": `Bearer ${123}`
    }
  })
  posters.value = response.data
})
</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">

        <h2 class="d-flex space-between">
          Афиши
          <a href="https://plpo.ru" target="_blank">
            <img src="../../assets/plpo.webp" alt="" srcset="" style="max-height: 50px;"></a>
        </h2>
      </a-col>
    </a-row>
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <a-row type="flex" justify="center">
          <a-col span="12" :md="6" v-for="poster in posters">
            <a-card class="ma-8">
              <template #cover>
                <img alt="example" :src="poster.image" />
              </template>
            </a-card>
          </a-col>
        </a-row>



      </a-col>
    </a-row>
  </div>
</template>
