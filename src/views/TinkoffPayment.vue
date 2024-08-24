<script setup>
import {onMounted} from "vue"
import { useRoute, useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue';

const route = useRoute()
const router = useRouter();
const backRoute = "/"

onMounted(()=>{
  // Проверяем, есть ли параметр `url` в строке запроса, если нет, перенаправляем на корень
  if (!route.query.url) {
    router.push("/");
  }
  // Проверяем, загружен ли сайт внутри iframe, если да, перенаправляем на корень
  if (window.self !== window.top) {
    window.top.location.href = "/";
  }
})
</script>
<template>
    <div style="height: 80vh; width: 100%">
        <BackButton :backRoute="backRoute" />
        <iframe :src="route.query.url" frameborder="0" width="100%" height="100%"></iframe>
    </div>
</template>