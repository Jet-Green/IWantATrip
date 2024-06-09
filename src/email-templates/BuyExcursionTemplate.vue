<script setup>
import { EContainer, EHeading, EHead, EHtml, ESection, EText } from 'vue-email';

let props = defineProps({
    toSend: Object,
    toEmail: Object
})
let prices = props.toSend
let form = props.toEmail

function getDate(dateNumber){
    return `${String(dateNumber.day).padStart(2,"0")}.${String(dateNumber.month).padStart(2,"0")}.${dateNumber.year}`
};
function getTime(timeObj) {
  let result = timeObj.hours + ':'
  if (timeObj.minutes < 10) {
    result += '0' + timeObj.minutes
  } else {
    result += timeObj.minutes
  }
  return result
}
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
            <e-heading as="h3">Куплена экскурсия</e-heading>
            <e-text>Экскурсия: <b>{{ form.name}}</b> </e-text>
            <e-text>Покупатель: <b>{{ form.fullname }}</b></e-text>
            <e-text>Телефон: <a :href="`tel:${form.phone}`"> <b>{{ form.phone}}</b></a></e-text>
            <e-text>Дата: <b>{{ getDate(form.date) }} - {{ getTime(form.time) }}</b></e-text>
            <e-text>Цены:</e-text>
            <e-text v-for="price in prices">
                <b>{{ price.type }}: {{ price.count }} x {{ price.price }}руб.</b>
            </e-text>
        </e-section>
    </e-html>
</template>
<style scoped></style>