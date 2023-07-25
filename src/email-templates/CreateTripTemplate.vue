<script setup>
import { EContainer, EHeading, EHead, EHtml, EPreview, ESection, EText } from 'vue-email';

defineProps({
    name: { type: String },
    start: { type: Number },
    end: { type: Number },
    maxPeople: { type: Number },
    duration: { type: String },
    images: { type: Array },
    pdfs: { type: Array },
    tripRoute: { type: String },
    distance: { type: String },
    cost: { type: Array },
    offer: { type: String },
    description: { type: String },
    startLocation: { type: Object },
    tripType: { type: String },
    fromAge: { type: String },
    bonuses: { type: Array },
    email: { type: String },
    fullinfo: { type: Object }
})

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
            <title>Создан тур</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                rel="stylesheet">
            <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.6.96/css/materialdesignicons.min.css" rel="stylesheet" />
        </e-head>

        <e-preview preview="Welcome to vue-email" />
        <e-section>
            <e-container>
                <e-heading as="h3">Создан Тур</e-heading>
                <e-text> Наименование: <b>{{ name}}</b> </e-text>
                <e-text> Дата: <b>{{clearData(start)  }}-{{ clearData(end)  }}</b> </e-text>
                <e-text> Создатель: <b>{{ fullinfo.fullname }}</b> </e-text>
                <e-text> Почта: <b>{{ email }}</b></e-text>
                <e-text> Телефон: <a href="tel:fullinfo.phone"> <b>{{ fullinfo.phone }}</b> </a></e-text>
                <e-text>Компания: <b>{{ fullinfo.companyName }}</b></e-text>
            </e-container>
        </e-section>
    </e-html>
</template>
<style scoped>
body {
    font-family: 'Montserrat', sans-serif;

}
</style>