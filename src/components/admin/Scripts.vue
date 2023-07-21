<script setup>
import axios from 'axios'

async function addFullInfoToBill() {
    let res = await axios.get(import.meta.env.VITE_API_URL + '/service-functions/add-fullinfo-to-bills')
    console.log(res.status);
}
</script>
<template>
    <a-popconfirm @confirm="addFullInfoToBill" title="Вы уверены?">
        <a-button>добавить fullinfo в каждый объект bill</a-button>
    </a-popconfirm>
</template>