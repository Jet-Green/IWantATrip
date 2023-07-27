<script setup>
import { EContainer, EHeading, EHead, EHtml, ESection, EText } from 'vue-email';

let props = defineProps({
    form: Object,
})
let companion = props.form
</script>
<template>
    <e-html>
        <e-head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Создан попутчик</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                rel="stylesheet">
            <!-- <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.6.96/css/materialdesignicons.min.css" rel="stylesheet" /> -->
        </e-head>

        <e-section>
            <e-heading as="h3">Создан попутчик</e-heading>
            <e-text>Имя Фамилия: {{ companion.name }} {{ companion.surname }}</e-text>
            <e-text>Направление: {{ companion.direction }}</e-text>
            <e-text>Описание: {{ companion.description }}</e-text>
            <e-text>Начало: {{ clearData(companion.start) }} </e-text>
            <e-text>Конец: {{ clearData(companion.end) }} </e-text>
            <e-text>Телефон: {{ companion.phone }} </e-text>
        </e-section>
    </e-html>
</template>
<style scoped></style>