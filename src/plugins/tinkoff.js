import axios from 'axios'

/**
 * Кабинет регистрации магазинов Т‑Банка (sm-register) — оформление договоров.
 *
 * Оплата сюда больше не входит: Init, GetState, Cancel и SendClosingReceipt
 * переехали на сервер (src/service/PaymentService.js → /payments/tinkoff/*).
 * Причин две. Во-первых, с 22.06.2026 securepay.tinkoff.ru отдаёт сертификат
 * российского УЦ, которого нет у большинства браузеров, — запрос из браузера
 * молча падал, и оплатить было нельзя. Во-вторых, пароль терминала лежал
 * в коде страницы, то есть был доступен любому посетителю.
 */

async function registerShop(shopData) {
    let res = await axios.post('https://sm-register.tinkoff.ru/register', shopData, { headers: { Authorization: `Bearer + ${import.meta.env.VITE_TINKOFF_SM_REGISTER_ACCESS_TOKEN}` } })
    console.log(res);
}

async function updateContract(contract) {
    let accessToken = localStorage.getItem('tinkoffAccessToken')
    let stringShopCode = contract.shopInfo.code
    let res = await axios.patch(`https://sm-register.tinkoff.ru/register/${stringShopCode}`, contract, { headers: { Authorization: `Bearer + ${accessToken}` } })

    return res
}

async function checkAuth() {
    // Обращаться к import.meta.env целиком нельзя: Vite подставляет в сборку
    // весь объект, то есть все VITE_-переменные разом. Именно так в публичный
    // JavaScript попадал пароль терминала. Берём только нужные поля.
    const body = {
        grant_type: 'password',
        username: import.meta.env.VITE_TINKOFF_USERNAME,
        password: import.meta.env.VITE_TINKOFF_PASSWORD
    }
    let res = await axios.post('https://sm-register.tinkoff.ru/oauth/token', body, { auth: { Username: 'partner', Password: 'partner' } })
    if (res.status == 200) {
        localStorage.setItem('tinkoffAccessToken', res.data.access_token)
        localStorage.setItem('tinkoffRefreshToken', res.data.refresh_token)
        return true
    }
    return false
}

export default { registerShop, updateContract, checkAuth }
