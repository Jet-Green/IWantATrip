<script setup>
import { onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

let router = useRouter()
let title = "403"
let subtitle = "У вас нет прав для доступа к этой странице"
let may_send_idea
try {
    let message = JSON.parse(localStorage.getItem('fallbackMessage'))
    title = message.title
    subtitle = message.subtitle
    may_send_idea = message.may_send_idea
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
            <a-button v-if="may_send_idea" @click="router.push('/send-idea')">Предложить идею</a-button>
        </template>
    </a-result>
</template>