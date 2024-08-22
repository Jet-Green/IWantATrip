<script setup>
import {onMounted} from "vue"
import { useRoute, useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue';

const route = useRoute()
const router = useRouter();
const backRoute = "/"

onMounted(()=>{
    if(!route.query.url) {
        router.push("/")
    }
})
</script>
<template>
    <div style="height: 80vh; width: 100%">
        <BackButton :backRoute="backRoute" />
        <iframe :src="route.query.url" frameborder="0" width="100%" height="100%"></iframe>
    </div>
</template>