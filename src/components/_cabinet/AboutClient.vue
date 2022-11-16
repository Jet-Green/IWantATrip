<script setup>
import { useAuth } from "../../stores/auth";

const userStore = useAuth();
</script>
<template>
  <div>
    <p>{{userStore.user}}</p>
  </div>
</template>
