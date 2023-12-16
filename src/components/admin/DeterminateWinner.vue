<script setup>
import { ref } from 'vue';
import { useAuth } from '../../stores/auth'
import confetti from "https://cdn.skypack.dev/canvas-confetti";

let winner = ref()
let loaded = ref(false)
let loading = ref(false)

async function getWinner() {
    loading.value = true
    loaded.value = false

    winner.value = await useAuth().determineWinner()
    confetti()

    loading.value = false
    loaded.value = true
}
</script>

<template>
    <div v-if="loaded && winner" class="w-100 d-flex justify-center align-center" style="margin-top: 8px">
        <div style=" padding: 20px;">
            <strong style="font-size: 26px;">{{ winner.fullname }}</strong>
            <div style="font-size: 18px;">{{ winner.email }}</div>
        </div>
    </div>

    <div v-else-if="!winner && loaded" class="d-flex justify-center">
        <b>Нет победителя</b>
    </div>

    <div v-else-if="loading" class="d-flex justify-center">
        <a-spin tip="Думаем!">
        </a-spin>
    </div>

    <div class="d-flex justify-center" style="margin-top: 20px;">
        <a-button @click="getWinner">Определить победителя</a-button>
    </div>
</template>
