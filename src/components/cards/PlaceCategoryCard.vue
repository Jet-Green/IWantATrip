<script setup>
import { useRouter } from "vue-router";

const router = useRouter()
</script>
<template>
  <a-card title="place category card" @click="router.push('/place?_id=12313')">
  </a-card>
</template>