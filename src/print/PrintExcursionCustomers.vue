<script setup>

let props = defineProps({
    excursion: Object,
    bookings: Array,
    time: String,
    date: String,
    bills: Object,
})

function calculateTotal(cart) {
   
    return cart.reduce((totalCost, item) => {
        return totalCost += item.price * item.count;
    }, 0);
}

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
                <td style="border-bottom: 1px solid black;">{{ booking?.user?.fullinfo?.fullname }} {{
        booking?.userInfo?.fullname }}</td>
                <td style="border-bottom: 1px solid black;">{{ booking?.user?.fullinfo?.phone }} {{
        booking?.userInfo?.phone }}</td>
                <td style="border-bottom: 1px solid black;">{{ booking?.count }} чел</td>
            </tr>
        </div>
        <div v-if="bills">
           
            <tr style="text-align:left; ">
                <th style="border-bottom: 1px solid black;">ФИО</th>
                <th style="border-bottom: 1px solid black;">Телефон</th>
                <th style="border-bottom: 1px solid black;">Тип</th>
                <th style="border-bottom: 1px solid black;">Количество</th>
                <th style="border-bottom: 1px solid black;">Сумма</th>
            </tr>

            <div v-for="bill in bills">
                <tr >
                    <td style="border-bottom: 1px solid black;">{{ bill?.user?.fullinfo?.fullname }} {{
        bill?.userInfo?.fullname }}</td>
                    <td style="border-bottom: 1px solid black;">{{ bill?.user?.fullinfo?.phone }} {{
        bill?.userInfo?.phone }}</td>
                    <td style="border-bottom: 1px solid black;">{{ bill.cart.type }}</td>
                    <td style="border-bottom: 1px solid black;">
                    <div v-for="item in bill.cart">
                        {{ item.type }}: {{ item.price }}*{{ item.count }}

                    </div>
                    </td>
                    <td style="border-bottom: 1px solid black;">{{calculateTotal(bill.cart)}} руб</td>
                </tr>
            </div>
        </div>
    </table>
</template>
