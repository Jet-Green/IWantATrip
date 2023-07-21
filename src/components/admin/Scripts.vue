<script setup>
import axios from 'axios'

async function addFullInfoToBill() {
    let res = await axios.get(import.meta.env.VITE_API_URL + '/service-functions/add-fullinfo-to-bills')
    console.log(res.status);
}
</script>
<template>
    <a-button @click="addFullInfoToBill">добавить fullinfo в каждый объект bill</a-button>
</template>