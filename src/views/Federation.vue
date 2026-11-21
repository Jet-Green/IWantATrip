<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import $api from '../plugins/axios'
import { safeAuthRedirect } from '../service/authRedirect'
const route = useRoute(), router = useRouter(), auth = useAuth()
const action = computed(() => route.params.action)
const post = async (path, body) => (await $api.post(path, body)).data
const safePath = safeAuthRedirect

const loading = ref(true), error = ref(''), linking = ref(false)
const email = ref(''), password = ref(''), state = ref('')
const valid = (value) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value)
const nativeLogin = computed(() => ({ path: '/auth', query: { redirect: '/' } }))
async function accept(data) {
  if (!data.accessToken || !data.user) throw new Error('Invalid response')
  localStorage.setItem('token', data.accessToken)
  auth.user = data.user
  auth.isAuth = true
  await router.replace(safePath(data.path))
}
async function proceed() {
  if (action.value !== 'authorize') return
  loading.value = true; error.value = ''
  if (!valid(route.query.state)) { error.value = 'Ссылка для входа недействительна. Начните вход заново.'; loading.value = false; return }
  try {
    if (!auth.isAuth) await auth.checkAuth()
    if (!auth.isAuth) { await router.replace({ path: '/auth', query: { redirect: route.fullPath } }); return }
    const data = await post('/auth/federation/issue', { state: String(route.query.state) })
    const target = new URL(data.url)
    if (target.origin !== 'https://rent.gorodaivesi.ru' || target.pathname !== '/federation/callback') throw new Error('Invalid destination')
    window.location.replace(target.href)
  } catch { error.value = 'Не удалось продолжить вход. Попробуйте ещё раз.'; loading.value = false }
}
async function linkAccount() {
  if (loading.value) return
  loading.value = true; error.value = ''
  try {
    const data = await post('/auth/federation/link', { state: state.value, email: email.value.trim(), password: password.value })
    password.value = ''
    await accept(data)
  } catch { password.value = ''; error.value = 'Не удалось подтвердить аккаунт. Проверьте email и пароль или начните вход заново.' }
  finally { loading.value = false }
}
onMounted(async () => {
  if (action.value === 'authorize') { await proceed(); return }
  if (action.value !== 'callback') { loading.value = false; error.value = 'Ссылка для входа недействительна.'; return }
  const params = new URLSearchParams(window.location.hash.slice(1))
  const code = params.get('code'), incomingState = params.get('state')
  window.history.replaceState({}, '', '/federation/callback')
  if (!valid(code) || !valid(incomingState)) { loading.value = false; error.value = 'Ссылка для входа недействительна. Начните вход заново.'; return }
  state.value = String(incomingState)
  try {
    const data = await post('/auth/federation/complete', { code: String(code), state: state.value })
    await accept(data)
  } catch (e) {
    const detail = e?.response?.data
    if (detail?.code === 'ACCOUNT_LINK_REQUIRED') linking.value = true
    else error.value = 'Не удалось завершить вход. Ссылка могла устареть. Начните вход заново.'
  } finally { loading.value = false }
})
</script>
<template>
  <section class="federation-page pa-16">
    <h1>{{ linking ? 'Подтвердите аккаунт «Города и Веси»' : 'Вход в «Города и Веси»' }}</h1>
    <p v-if="loading" role="status" aria-live="polite">Продолжаем вход…</p>
    <p v-if="error" role="alert">{{ error }}</p>
    <form v-if="linking" class="federation-form" @submit.prevent="linkAccount">
      <p>Аккаунт с таким email уже существует. Введите его пароль, чтобы связать аккаунты.</p>
      <label for="federation-email">Email</label>
      <a-input id="federation-email" v-model:value="email" type="email" autocomplete="username" required size="large" />
      <label for="federation-password">Пароль аккаунта «Города и Веси»</label>
      <a-input-password id="federation-password" v-model:value="password" autocomplete="current-password" required size="large" />
      <a-button type="primary" html-type="submit" :loading="loading" :disabled="loading">Подтвердить и войти</a-button>
    </form>
    <a-button v-if="error && action === 'authorize'" @click="proceed" :disabled="loading">Повторить</a-button>
    <router-link v-if="!loading" :to="nativeLogin">Вернуться ко входу</router-link>
  </section>
</template>
<style scoped>
.federation-page { max-width: 520px; margin: 32px auto; overflow-wrap: anywhere; }
.federation-form { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.federation-page > a { display: block; margin-top: 20px; }
</style>
