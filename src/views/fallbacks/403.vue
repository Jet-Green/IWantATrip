<script setup>
import { onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue';

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
</script>
<template>
    <div>
        <BackButton :back-route="{ path: '/' }" />
        <a-result status="403" :title="title" :sub-title="subtitle">
            <template #extra>
                <div class="d-flex flex-wrap justify-center ">
                    <a-button v-if="may_send_idea" @click="router.push('/send-idea')" class="lets_go_btn ma-4" type="primary"
                        size="large" shape="round">Предложить идею</a-button>
                    <a-button size="large" shape="round" class=" ma-4">заключить договор</a-button>
                </div>

            </template>
        </a-result>
    </div>
</template>