<script setup>
import { ref, watch } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
let status = ref("on-moderation")

watch(status, (newStatus) => {
  router.push('/cabinet/moderation-tracks/' + newStatus)
})
</script>

<template>
  <a-row>
    <a-col :span="24">
      <h3>Маршруты на модерации</h3>
      <a-radio-group v-model:value="status">
        <a-radio value="on-moderation">На модерации</a-radio>
        <a-radio value="rejected">Отказанные</a-radio>
        <a-radio value="manage">Управление</a-radio>
      </a-radio-group>

      <router-view />
    </a-col>
  </a-row>
</template>
