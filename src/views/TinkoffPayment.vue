<script setup>
import {onMounted} from "vue"
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

onMounted(()=>{

  // Проверяем, загружен ли сайт внутри iframe, если да, перенаправляем на корень
  if (window.self !== window.top) {
    window.top.location.href = "/";
  }
})
</script>
<template>
    <div style="height: 80vh; width: 100%">
      
        <iframe :src="route.query.url" frameborder="0" width="100%" height="100%"></iframe>
    </div>
</template>