<script setup>
import BackButton from "../BackButton.vue";

import PosterService from "../../service/PosterService"
import { onMounted, ref } from "vue";
import axios from "axios";

let posters = ref()

onMounted(async () => {
  let response = await axios.post('http://localhost:3031/api/get-all', {}, {
    headers: {
      "Authorization": `Bearer ${123}`
    }
  })
  posters.value = response.data
  console.log(posters.value)
})
</script>
<template>
  <div>
    <BackButton />

    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <h2>
          Афиши
        </h2>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center">
      <a-col span="24" :md="4" v-for="poster in posters">
        <a-card class="ma-8">
          <template #cover>
            <img alt="example" :src="poster.image" />
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
