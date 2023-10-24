<script setup>
import { onMounted } from 'vue';

defineProps({
    customers: Object,
    trip: Object,
    total: Object
})

const clearData = (dateNumber) => {
    let date = new Date(dateNumber).toLocaleDateString("ru-Ru", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    });
    if (date !== "Invalid Date" && date) {
        return date;
    }
    return "";
};
</script>
<template>
    <h3 style="text-align:center">{{ trip.name }}</h3>
    <h4 style="text-align:center">с {{ clearData(trip.start) }} по {{ clearData(trip.end) }} </h4>
    <h2 style="text-align:center">Список туристов</h2>
    <table style="width:100%">
        <tr style="text-align:left; ">
            <th style="border-bottom: 1px solid black;">п/н</th>
            <th style="border-bottom: 1px solid black;">Имя</th>
            <th style="border-bottom: 1px solid black;">Место посадки</th>
            <th style="border-bottom: 1px solid black;">Телефон</th>
            <th style="border-bottom: 1px solid black;">Количество</th>
        </tr>

        <tr v-for="customer, i in customers" :key="i">
            <td style="border-bottom: 1px solid black;">{{ i + 1 }}</td>
            <td style="border-bottom: 1px solid black;">
                <div v-for="unit, j in customer.touristsList">
                    {{ unit.fullname }}
                </div>
            </td>
            <td style="border-bottom: 1px solid black;">
                {{ customer.selectedStartLocation }}
            </td>
            <td style="border-bottom: 1px solid black;">
                <div v-for="unit, j in customer.touristsList">
                    {{ unit.phone }}
                </div>
            </td>
            <td style="border-bottom: 1px solid black;">
                <span v-for="item, j in  customer.cart">
                    {{ item.count }}
                    <span v-if="customer.cart.length > j + 1">+</span>
                </span>

            </td>
        </tr>
        <!-- <tr v-for="customer, i in customers" :key="i">
            <td>{{ i + 1 }}<
                /td>
            <td>{{ customer.userInfo.fullname }}</td>
            <td>{{ customer.userInfo.phone }}</td>
            <td>
                <span v-for="item, j in  customer.cart">
                    {{ item.count }}
                    <span v-if="customer.cart.length > j + 1">+</span>
                </span>
            
            </td>
        </tr> -->
    </table>
    <span v-if="total">
        <h3>
            Итого:
            {{ total.amount }}
        </h3>
    </span>
</template>

