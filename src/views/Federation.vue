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
  <section class="federation-page" :aria-busy="loading">
    <div class="federation-brand" aria-hidden="true">
      <img src="../assets/images/logo.webp" alt="" width="128" height="60" />
      <span class="federation-brand__separator"></span>
      <img src="../assets/images/rental-mark.svg" alt="" width="40" height="40" />
    </div>
    <h1>{{ linking ? 'Подтвердите аккаунт' : 'Вход в «Города и Веси»' }}</h1>
    <p v-if="linking" class="federation-description">Аккаунт с таким email уже существует. Введите его пароль, чтобы связать аккаунты.</p>
    <div v-if="loading" class="federation-loading" role="status" aria-live="polite">
      <a-spin />
      <p>{{ linking ? 'Подтверждаем аккаунт…' : 'Продолжаем вход…' }}</p>
    </div>
    <p v-if="error" class="federation-error" role="alert">{{ error }}</p>
    <form v-if="linking" class="federation-form" @submit.prevent="linkAccount">
      <label for="federation-email">Email</label>
      <a-input id="federation-email" v-model:value="email" type="email" autocomplete="username" required size="large" :disabled="loading" />
      <label for="federation-password">Пароль аккаунта «Города и Веси»</label>
      <a-input-password id="federation-password" v-model:value="password" autocomplete="current-password" required size="large" :disabled="loading" />
      <a-button class="lets_go_btn" type="primary" html-type="submit" size="large" :loading="loading" :disabled="loading">Подтвердить и войти</a-button>
    </form>
    <a-button v-if="error && action === 'authorize'" class="lets_go_btn" type="primary" size="large" @click="proceed" :disabled="loading">Повторить</a-button>
    <router-link v-if="!loading" class="federation-back" :to="nativeLogin">Вернуться ко входу</router-link>
  </section>
</template>
<style scoped>
.federation-page { width: calc(100% - 32px); max-width: 520px; box-sizing: border-box; margin: 40px auto 64px; padding: clamp(20px, 5vw, 32px); border: 1px solid #e0e0e0; border-radius: 24px; background: #fff; overflow-wrap: anywhere; text-align: center; }
.federation-brand { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 24px; }
.federation-brand img { object-fit: contain; }
.federation-brand__separator { width: 1px; height: 32px; background: #e0e0e0; }
.federation-page h1 { font-size: clamp(1.5rem, 1.1975rem + 0.6303vw, 1.875rem); line-height: 1.3; margin-bottom: 16px; }
.federation-description { margin-bottom: 24px; }
.federation-loading { padding: 16px 0; }
.federation-loading p { margin: 12px 0 0; }
.federation-error { padding: 12px 16px; margin-bottom: 20px; border-radius: 12px; background: #fff4ec; color: #933a00; text-align: left; }
.federation-form { display: flex; flex-direction: column; gap: 8px; text-align: left; }
.federation-form label:not(:first-child) { margin-top: 8px; }
.federation-form button { height: auto; min-height: 44px; margin-top: 16px; white-space: normal; }
.federation-back { display: block; width: fit-content; margin: 24px auto 0; color: #ff6600; text-decoration: underline; }
.federation-back:focus-visible { outline: 2px solid #ff6600; outline-offset: 4px; }
</style>
