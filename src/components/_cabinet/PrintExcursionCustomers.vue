<script setup>
import { onMounted } from 'vue';


let props = defineProps({
    excursion: Object,
    bookings: Array
})

onMounted(() => {
    console.log(props.bookings)
})
</script>
<template>
    <h2 style="text-align:center">{{ excursion.name }}</h2>
    <h3 style="text-align:center">Список туристов</h3>
    <table style="width:100%">
        <tr style="text-align:left; ">
            <th style="border-bottom: 1px solid black;">п/н</th>
            <th style="border-bottom: 1px solid black;">Имя</th>
            <th style="border-bottom: 1px solid black;">Место посадки</th>
            <th style="border-bottom: 1px solid black;">Телефон</th>
            <th style="border-bottom: 1px solid black;">Количество</th>
            <th style="border-bottom: 1px solid black;">Места</th>
        </tr>
        <tr v-for="booking, i in bookings" :key="i">
            <td style="border-bottom: 1px solid black;">{{booking.user.fullinfo.fullname }}</td>
            <td style="border-bottom: 1px solid black;">{{booking.user.fullinfo.phone }}</td>
        </tr>
    </table>
</template>
