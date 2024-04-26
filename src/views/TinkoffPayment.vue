<script setup>
import { useRoute } from 'vue-router'
import BackButton from '../components/BackButton.vue';

const route = useRoute()
</script>
<template>
    <div style="height: 80vh; width: 100%">
        <BackButton />
        <iframe :src="route.query.url" frameborder="0" width="100%" height="100%"></iframe>
    </div>
</template>