// Вход через VK ID (OAuth 2.1 + PKCE, https://id.vk.com).
// Секретов на клиенте нет: code_verifier одноразовый, обмен кода делает бэкенд (POST /auth/vk).

const VK_AUTH_URL = 'https://id.vk.com/authorize'
const STORAGE_KEY = 'vkAuth'

function base64url(bytes) {
    return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
}

function randomString(length) {
    return base64url(crypto.getRandomValues(new Uint8Array(length))).slice(0, length)
}

export function getVkRedirectUri() {
    return `${window.location.origin}/auth/vk-callback`
}

// Сохраняет PKCE-данные в sessionStorage и уводит на страницу входа VK
export async function redirectToVkAuth(redirectAfter = '/') {
    const codeVerifier = randomString(64)
    const state = randomString(32)
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
    const codeChallenge = base64url(new Uint8Array(digest))

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ codeVerifier, state, redirectAfter }))

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: import.meta.env.VITE_VK_CLIENT_ID,
        redirect_uri: getVkRedirectUri(),
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state,
        scope: 'email',
    })
    window.location.href = `${VK_AUTH_URL}?${params}`
}

// Забирает и удаляет сохранённые PKCE-данные (одноразовые)
export function takeVkAuthContext() {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}
