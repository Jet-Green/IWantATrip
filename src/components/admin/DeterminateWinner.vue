<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { useAuth } from '../../stores/auth'
// Конфетти — из пакета, а не с внешнего CDN: cdn.skypack.dev отвечал ошибкой,
// и из-за импорта на верхнем уровне не загружалась вся страница розыгрыша.
import confetti from 'canvas-confetti';

let winner = ref()
let loaded = ref(false)
let loading = ref(false)

async function getWinner() {
    loading.value = true
    loaded.value = false
    winner.value = null

    try {
        winner.value = await useAuth().determineWinner()
        if (winner.value) confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } })
    } catch (error) {
        message.error({ content: error.response?.data?.message || 'Не удалось определить победителя' })
    }

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
        <b>Сегодня ещё никто не регистрировался</b>
    </div>

    <div v-else-if="loading" class="d-flex justify-center">
        <a-spin tip="Думаем!">
        </a-spin>
    </div>

    <div class="d-flex justify-center" style="margin-top: 20px;">
        <a-button @click="getWinner" :loading="loading">Определить победителя</a-button>
    </div>
</template>
