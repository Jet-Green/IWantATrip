<script setup>
import { EContainer, EHeading, EHead, EHtml, ESection, EText } from 'vue-email';

let props = defineProps({
    form: Object,
    email: { type: String },
    fullinfo: { type: Object }
})
let form = props.form
let email = props.email
let fullinfo = props.fullinfo
const clearData = (dateNumber) => {
  let date = new Date(dateNumber).toLocaleDateString("ru-Ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  })
  if (date !== 'Invalid Date' && date) {
    return date
  }
  return ''
}
</script>
<template>
    <e-html lang="ru">
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
                <e-heading as="h3">Создан Тур</e-heading>
                <e-text> Наименование: <b>{{ form.name}}</b> </e-text>
                <e-text> Дата: <b>{{clearData(form.start)  }}-{{ clearData(form.end)  }}</b> </e-text>
                <e-text> Создатель: <b>{{ fullinfo.fullname }}</b> </e-text>
                <e-text> Почта: <b>{{ email }}</b></e-text>
                <e-text> Телефон: <a href="tel:fullinfo.phone"> <b>{{ fullinfo.phone }}</b> </a></e-text>
                <e-text>Компания: <b>{{ fullinfo.companyName }}</b></e-text>
        </e-section>
    </e-html>
</template>
<style scoped>
body {
    font-family: 'Montserrat', sans-serif;

}
</style>