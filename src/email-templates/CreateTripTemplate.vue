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
                <e-heading as="h2">Создан Тур: {{ name }}</e-heading>
                <span class="mdi mdi-account"></span>
                <span class="mdi mdi-email-box"></span>
                <span class="mdi mdi-phone"></span>
                <span class="mdi mdi-domain"></span>
            </e-container>
        </e-section>
    </e-html>
</template>
<style scoped>
body {
    font-family: 'Montserrat', sans-serif;
    display: flex;
    justify-content: center;
}

.outer {
    font-size: 16px;
    max-width: 90%;
}

.row {
    margin: 16px 0 16px 0;
}

/* .col {
} */
.cost-item {
    display: flex;
    align-items: center;
    margin-top: 4px;
}

p {
    margin: 0 6px 0;
}
</style>