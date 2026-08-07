const DADATA_SUGGEST_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address"

// По умолчанию DaData ищет только по России. Беларусь (а также Казахстан и
// Узбекистан) нужно включать явно через locations — иначе «Гродно» находит
// только российские деревни Городно, а «Беларусь» — СНТ «Беларусь» в Лангепасе.
export const DADATA_COUNTRIES = [
    { country_iso_code: "RU" },
    { country_iso_code: "BY" },
]

// Как только в запросе появляется locations, DaData дописывает страну в начало
// value («Россия, г Москва»). Для России убираем её, чтобы названия совпадали
// с теми, что уже сохранены в базе. Для Беларуси страну оставляем.
function normalizeValue(value) {
    return typeof value === "string" ? value.replace(/^Россия,\s*/, "") : value
}

/**
 * Подсказки адресов DaData по России и Беларуси.
 * @param {string} query поисковая строка
 * @param {{ count?: number, fromBound?: string, toBound?: string }} [options]
 * @returns {Promise<Array>} массив suggestions DaData (пустой при ошибке)
 */
export async function suggestAddress(query, options = {}) {
    const { count = 5, fromBound = "city", toBound = "settlement" } = options

    const res = await fetch(DADATA_SUGGEST_URL, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + import.meta.env.VITE_DADATA_TOKEN
        },
        body: JSON.stringify({
            query,
            count,
            from_bound: { value: fromBound },
            to_bound: { value: toBound },
            locations: DADATA_COUNTRIES
        })
    })

    const data = await res.json()

    return (data?.suggestions ?? []).map((s) => ({
        ...s,
        value: normalizeValue(s.value),
        unrestricted_value: normalizeValue(s.unrestricted_value)
    }))
}
