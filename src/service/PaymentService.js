import $api from "../plugins/axios";

/**
 * Оплата через Т‑Банк. Раньше браузер ходил в эквайринг напрямую, с паролем
 * терминала в коде страницы. С 22.06.2026 банк отдаёт сертификат российского УЦ,
 * которого нет у большинства браузеров, и запрос молча падал — оплатить было
 * нельзя. Теперь в банк ходит сервер, а клиент передаёт только номер счёта:
 * сумму и состав чека сервер считает сам.
 */
export default {
    async createTripPayment(billId) {
        return $api.post('/payments/tinkoff/trip-payment', { billId })
    },
    async createExcursionPayment(billId) {
        return $api.post('/payments/tinkoff/excursion-payment', { billId })
    },
    async getState(billId, kind = 'trip') {
        return $api.post('/payments/tinkoff/state', { billId, kind })
    },
    async cancel(billId, { kind = 'trip', amountRub = null, receipt = null } = {}) {
        return $api.post('/payments/tinkoff/cancel', { billId, kind, amountRub, receipt })
    },
}
