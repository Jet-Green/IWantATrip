// Даты тура (start/end) хранятся как таймстамп локальной полуночи автора,
// а сдвиг его часового пояса — в поле timezoneOffset тура. Поэтому при выводе
// сдвиг вычитается, а дата печатается в UTC: иначе у зрителя из другого пояса
// дата уезжает на день.

/**
 * Дата тура в формате ДД.ММ.ГГ.
 * Если timezoneOffset у тура не сохранён (старые туры, созданные из каталога),
 * печатаем дату в поясе зрителя — это лучше, чем пустая строка.
 * @param {number|string} timestamp
 * @param {number} [timezoneOffset] сдвиг пояса автора в миллисекундах
 * @returns {string} пустая строка, если даты нет
 */
export function formatTripDate(timestamp, timezoneOffset) {
    const ts = Number(timestamp)
    if (!Number.isFinite(ts)) return ''

    const offset = Number(timezoneOffset)
    const hasOffset = Number.isFinite(offset)

    const date = new Date(hasOffset ? ts - offset : ts)
    if (Number.isNaN(date.getTime())) return ''

    return date.toLocaleDateString('ru-RU', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        ...(hasOffset ? { timeZone: 'UTC' } : {}),
    })
}

/**
 * Период тура для карточек: «ДД.ММ.ГГ» или «с ДД.ММ.ГГ по ДД.ММ.ГГ».
 * Если тур уже прошёл, показываем ближайшую будущую дату из дочерних туров.
 * @param {object} trip
 * @returns {string} пустая строка, если дат нет
 */
export function formatTripPeriod(trip) {
    if (!trip) return ''

    let start = formatTripDate(trip.start, trip.timezoneOffset)
    let end = formatTripDate(trip.end, trip.timezoneOffset)

    if (trip.start < Date.now()) {
        for (const child of trip.children ?? []) {
            if (child?.start >= Date.now()) {
                start = formatTripDate(child.start, child.timezoneOffset ?? trip.timezoneOffset)
                end = formatTripDate(child.end, child.timezoneOffset ?? trip.timezoneOffset)
            }
        }
    }

    if (start === end) return start
    if (!start || !end) return start || end

    return 'с ' + start + ' по ' + end
}
