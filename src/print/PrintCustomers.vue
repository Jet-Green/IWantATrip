<script setup>
defineProps({
    customers: Object,
    tripName: String
})
</script>
<template>
    <h3 style="text-align:center">{{ tripName }}</h3>
    <h2 style="text-align:center">Список туристов</h2>
    <table style="width:100%">
        <tr style="text-align:left">
            <th>п/н</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Количество</th>
        </tr>
        <tr v-for="customer, i in customers" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ customer.userInfo.fullname }}</td>
            <td>{{ customer.userInfo.phone }}</td>
            <td>
                <span v-for="item, j in  customer.cart">
                    {{ item.count }}
                    <span v-if="customer.cart.length > j + 1">+</span>
                </span>
            
            </td>
        </tr>

    </table>
</template>
