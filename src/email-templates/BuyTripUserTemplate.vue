<script setup>
import { EContainer, EHeading, EHead, EHtml, ESection, EText } from 'vue-email';

let props = defineProps({
    form: Object,
    trip: Object,
})
let bought = props.form
let trip = props.trip
</script>
<template>
    <e-html>
        <e-head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                rel="stylesheet">
            <!-- <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.6.96/css/materialdesignicons.min.css" rel="stylesheet" /> -->
        </e-head>

        <e-section>
            <e-heading as="h3">Куплена поездка</e-heading>
            <e-text>Тур: <b>{{ trip.name }}</b> </e-text>
            <e-text>Покупатель: <b>{{ bought.userInfo.fullname }}</b></e-text>
            <e-text>Телефон: <a href="tel:fullinfo.phone"> <b>{{ bought.userInfo.phone }}</b></a></e-text>
            <e-text>Заказ:</e-text>
            <e-text v-for="price in bought.cart">
                <b>{{ price.count }} x {{ price.cost }}руб.</b>
            </e-text>
            <e-text>
                Оплачен: <b>{{ bought.isBoughtNow? "да": "нет" }}</b>
            </e-text>

        </e-section>
    </e-html>
</template>
<style scoped></style>