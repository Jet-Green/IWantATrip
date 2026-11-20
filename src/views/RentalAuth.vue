<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import $api from '../plugins/axios'
import '../assets/rental.scss'
const route = useRoute(), router = useRouter(), auth = useAuth(), error = ref(''), loading = ref(true)
async function proceed() {
  loading.value = true; error.value = ''
  const { listingId, state } = route.query
  if (!/^[a-f\d]{24}$/i.test(listingId || '') || !/^[a-f\d]{64}$/i.test(state || '')) { error.value = 'Ссылка для перехода недействительна. Откройте объект и нажмите «Забронировать» ещё раз.'; loading.value = false; return }
  try {
    if (!auth.isAuth && localStorage.getItem('token')) await auth.checkAuth()
    if (!auth.isAuth) { await router.replace({ path: '/auth', query: { redirect: route.fullPath } }); return }
    const { data } = await $api.post('/auth/rental-handoff', { listingId, state })
    const target = new URL(data.url)
    if (target.origin !== 'https://rent.gorodaivesi.ru' || target.pathname !== '/auth/gorodaivesi/callback') throw new Error('Invalid handoff URL')
    window.location.assign(target.href)
  } catch { error.value = 'Не удалось перейти к бронированию. Попробуйте ещё раз.'; loading.value = false }
}
onMounted(proceed)
</script>
<template><div class="rental-page rental-state"><p v-if="loading" role="status">Переходим к бронированию…</p><div v-else role="alert"><p>{{ error }}</p><button class="rental-button" @click="proceed">Повторить</button></div><router-link class="rental-back" to="/rental">К объектам аренды</router-link></div></template>
