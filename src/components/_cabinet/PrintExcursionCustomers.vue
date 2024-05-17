<script setup>
import { onMounted } from 'vue';


let props = defineProps({
    excursion: Object,
    bookings: Array,
    time: String,
    date: String
})

onMounted(() => {
    console.log( props.date );


})
</script>
<template>
    <h2 style="text-align:center">{{ excursion.name }}</h2>
    <h3 style="text-align:center">{{ date.split('_').join(' ') }} {{ time }}</h3>
    <h2 style="text-align:center">Список туристов</h2>
    <table style="width:100%">
        <tr style="text-align:left; ">
            <th style="border-bottom: 1px solid black;">ФИО</th>
            <th style="border-bottom: 1px solid black;">Телефон</th>
            <th style="border-bottom: 1px solid black;">Количество</th>
        </tr>
        <tr v-for="booking, i in bookings" :key="i">
            <td style="border-bottom: 1px solid black;">{{ booking.user.fullinfo.fullname }}</td>
            <td style="border-bottom: 1px solid black;">{{ booking.user.fullinfo.phone }}</td>
            <td style="border-bottom: 1px solid black;">{{ booking.count }} чел</td>
        </tr>
    </table>
</template>
