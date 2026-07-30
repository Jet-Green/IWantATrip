<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuth } from '../stores/auth'
import { getVkRedirectUri, takeVkAuthContext } from '../service/vkAuth'

const router = useRouter()
const route = useRoute()
const authStore = useAuth()

const error = ref('')

onMounted(async () => {
    const saved = takeVkAuthContext()
    const { code, state, device_id } = route.query

    if (!code || !device_id || !saved || state !== saved.state) {
        error.value = 'Не удалось войти через VK. Попробуйте ещё раз.'
        return
    }

    const result = await authStore.loginVk({
        code,
        deviceId: device_id,
        codeVerifier: saved.codeVerifier,
        redirectUri: getVkRedirectUri(),
    })

    if (result.success) {
        message.config({ duration: 0.5, top: '70vh' })
        message.success('Успешно!')
        // если VK не отдал почту — ведём в кабинет, там попросим её указать
        router.replace(authStore.needRealEmail() ? '/cabinet/me' : (saved.redirectAfter || '/'))
    } else {
        error.value = result.message || 'Не удалось войти через VK. Попробуйте ещё раз.'
    }
})
</script>

<template>
    <a-row type="flex" justify="center" class="pa-16">
        <a-col class="d-flex direction-column align-center" style="gap: 16px; margin-top: 15vh;">
            <template v-if="!error">
                <a-spin size="large" />
                <span>Входим через VK…</span>
            </template>
            <template v-else>
                <span>{{ error }}</span>
                <router-link to="/auth">Вернуться ко входу</router-link>
            </template>
        </a-col>
    </a-row>
</template>
