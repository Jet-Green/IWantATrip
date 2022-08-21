<script setup>
import { ref } from 'vue'

let phoneNumber = ref('')
</script>
<template>
    <a-row type="flex" justify="center">
        <a-col :xs="22" :lg="16">
            <a-row type="flex" justify="center">
                <a-col :xs="24" :md="16" :lg="10">
                    <h2>Создать тур</h2>
                    <a-input placeholder="Введите телефон" size="large" v-model:value="phoneNumber"></a-input>
                </a-col>
            </a-row>
            <a-row type="flex" justify="center">
                <a-col :xs="24" :md="16" :lg="10" class="mt-8">
                    Турагент свяжется с вами, и вы вместе создадите тур
                </a-col>
            </a-row>
            <a-row type="flex" justify="center">
                <a-col :xs="24" :md="16" :lg="10" class="d-flex justify-center">
                    <a-button class="mt-16" type="primary" shape="round" size="large">Отправить</a-button>
                </a-col>
            </a-row>


        </a-col>
    </a-row>
</template>
<style>
</style>