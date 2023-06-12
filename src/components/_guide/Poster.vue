<script setup>
import BackButton from "../BackButton.vue";

import { useRouter } from 'vue-router';
import { useGuide } from "../../stores/guide";

import PosterService from "../../service/PosterService"
import { onMounted, ref } from "vue";

let posters = ref()

onMounted(async () => {
  let response = await PosterService.getPosters()
  posters.value = response.data
  console.log(posters.value)
})
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <p>Афиша</p>
      </a-col>
        <a-col v-for="poster in posters">
          <a-col>
          <a-card>
            <a-card-grid style="width: 50%; text-align: center">{{ poster.image }}</a-card-grid>
            <a-card-grid style="width: 50%; text-align: center" :hoverable="false">{{ poster.title }}</a-card-grid>
          </a-card>
        </a-col>
        </a-col>
    </a-row>
  </div>
</template>
