<script setup>
import { ref } from 'vue';

let form = ref({
    name: '',
    bus_width: 800, // cm
    bus_height: 255, // cm
})

</script>

<template>
    <a-row :gutter="[0, 8]">
        <a-col span="24">
            <a-input v-model:value="form.name" placeholder="Название"></a-input>
        </a-col>
        <a-col span="24">
            Длина автобуса
            <a-input v-model:value="form.bus_width"></a-input>
        </a-col>
        <a-col span="24">
            Ширина автобуса
            <a-input v-model:value="form.bus_height"></a-input>
        </a-col>
    </a-row>
</template>

<style lang="scss" scoped>

</style>