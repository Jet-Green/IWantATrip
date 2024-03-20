<script setup>
import { onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

let router = useRouter()
let title = "403"
let subtitle = "У вас нет прав для доступа к этой странице"
try {
    let message = JSON.parse(localStorage.getItem('fallbackMessage'))
    title = message.title
    subtitle = message.subtitle
} catch (error) {
    console.log(error);
}
onUnmounted(() => {
    localStorage.removeItem('fallbackMessage')
})
</script>
<template>
    <a-result status="403" :title="title" :sub-title="subtitle">
        <template #extra>
            <a-button @click="router.back()">Назад</a-button>
        </template>
    </a-result>
</template>