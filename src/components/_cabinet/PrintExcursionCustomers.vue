<script setup>
import { onMounted } from 'vue';


let props = defineProps({
    excursion: Object,
    bookings: Array,
    time: String,
    date: String,
    bills: Object,
})

onMounted(() => {
    console.log(props.bills);
});

</script>
<template>
    <h2 style="text-align:center">{{ excursion.name }}</h2>
    <h3 style="text-align:center">{{ date.split('_').join(' ') }} {{ time }}</h3>
    <h2 style="text-align:center">Список туристов</h2>
    <table style="width:100%">
        <div v-if="bookings">
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
        </div>
        <div v-else>
            <tr style="text-align:left; ">
                <th style="border-bottom: 1px solid black;">ФИО</th>
                <th style="border-bottom: 1px solid black;">Телефон</th>
                <th style="border-bottom: 1px solid black;">Тип</th>
                <th style="border-bottom: 1px solid black;">Колличество</th>
                <th style="border-bottom: 1px solid black;">Сумма</th>
            </tr>

            <div v-for="bill in bills">
                <tr v-for="cart in bill.cart">
                    <td style="border-bottom: 1px solid black;">{{ bill.user.fullinfo.fullname }}</td>
                    <td style="border-bottom: 1px solid black;">{{ bill.user.fullinfo.phone }}</td>
                    <td style="border-bottom: 1px solid black;">{{ cart.type }}</td>
                    <td style="border-bottom: 1px solid black;">{{ cart.count }} чел</td>
                    <td style="border-bottom: 1px solid black;">{{ cart.price }} руб</td>
                </tr>
            </div>
        </div>
    </table>
</template>
