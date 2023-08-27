<script setup>
import axios from 'axios'

async function addFullInfoToBill() {
    let res = await axios.get(import.meta.env.VITE_API_URL + '/service-functions/add-fullinfo-to-bills')
    console.log(res.status);
}
async function addStartLocToLocNamesAndInclTrips() {
    let res = await axios.get(import.meta.env.VITE_API_URL + '/service-functions/add-start-loc-to-incl-trips')
    console.log(res);
}
</script>
<template>
    <a-popconfirm @confirm="addFullInfoToBill" title="Вы уверены?">
        <a-button>добавить fullinfo в каждый объект bill</a-button>
    </a-popconfirm>
    <a-popconfirm @confirm="addStartLocToLocNamesAndInclTrips" title="Вы уверены?">
        <a-button>добавить startLocation как первый элемент массива includedTrips и locationNames</a-button>
    </a-popconfirm>
</template>