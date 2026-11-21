<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import $api from '../plugins/axios'
import BackButton from '../components/BackButton.vue'
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
<template>
  <div class="rental-auth" :aria-busy="loading">
    <BackButton :backRoute="{ name: 'RentalCatalog' }" />
    <a-row justify="center">
      <a-col :xs="22" :xl="16">
        <div class="rental-auth__state">
          <template v-if="loading">
            <a-spin size="large" />
            <p role="status">Переходим к бронированию…</p>
          </template>
          <div v-else role="alert">
            <h1>Не удалось перейти к бронированию</h1>
            <p>{{ error }}</p>
            <a-button type="primary" class="lets_go_btn" @click="proceed">Повторить</a-button>
          </div>
          <router-link class="rental-auth__back" :to="{ name: 'RentalCatalog' }">К объектам аренды</router-link>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped lang="scss">
.rental-auth {
  padding-bottom: 64px;
  overflow-wrap: anywhere;

  &__state { padding: 40px 0; text-align: center; }
  &__state h1 { font-size: clamp(1.5rem, 1.1975rem + 0.6303vw, 1.875rem); line-height: 1.3; }
  &__state p { margin: 16px 0 20px; }
  &__back { display: block; width: fit-content; margin: 24px auto 0; color: #ff6600; text-decoration: underline; }
  &__back:focus-visible { outline: 2px solid #ff6600; outline-offset: 4px; }
}
</style>
