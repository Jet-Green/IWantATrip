import dayjs from 'dayjs'
import objectSupport from 'dayjs/plugin/objectSupport'
dayjs.extend(objectSupport);
export default {
    excursions: {
        /**
         * принимает dates в формате массива дат(dayjs) 
         * times в формате {hours: Number, minutes: Number, seconds: Number}
         * возвращает Array<Object> { date: Object, times: Array<Object> }
         */
        concatDateAndTime(dates, times) {
            let res = []
            // если их длина не совпадает
            if (dates.length != times.length) return []

            for (let i = 0; i < dates.length; i++) {
                let date = dayjs(dates[i])
                res.push({
                    date: { year: date.$y, month: date.$M, day: date.$D },
                    times: times[i]
                })
            }

            return res
        },
        // for ExcursionPage
        getPrettyDate(dateObj) {
            const dayjsDate = dayjs({ years: dateObj.year, months: dateObj.month, date: dateObj.day })
            if (!dayjsDate.$d) return ''
            let russianDate = (new Date(dayjsDate.$d)).toLocaleDateString('ru-RU', {
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            }).replaceAll(',', '').split(' ')

            return { weekday: russianDate[0], day: russianDate[1], month: russianDate[2] }
        },
        getDateFromIsoDate(isoDate) {
            // Преобразуем строку в объект Date
            const date = new Date(isoDate);
            // Определяем массивы для названий месяцев и дней недели
            const months = [
                "января", "февраля", "марта", "апреля", "мая", "июня",
                "июля", "августа", "сентября", "октября", "ноября", "декабря"
            ];
            // Получаем день, месяц и год из объекта Date
            const day = date.getUTCDate();
            const month = months[date.getUTCMonth()];
            const year = date.getUTCFullYear();

            // Формируем строку в нужном формате
            return `${day} ${month} ${year}`;
        },
        getNumeralDay(index) {
            let numeralDay = ["первый", "второй", "третий", "четвертый", "пятый", "шестой", "седьмой",
                "восьмой", "девятый", "десятый", "одиннадцатый", "двенадцатый", "тринадцатый",
                "четырнадцатый", "пятнадцатый", "шестнадцатый", "семнадцатый", "восемнадцатый",
                "девятнадцатый", "двадцатый", "двадцать первый", "двадцать второй", "двадцать третий",
                "двадцать четвертый", "двадцать пятый", "двадцать шестой", "двадцать седьмой",
                "двадцать восьмой", "двадцать девятый", "тридцатый", "тридцать первый"]
            return (index >= 0 && index < numeralDay.length) ? numeralDay[index] : "";
        },
        getLocalDateFromUTC(utcTimestamp, timezoneOffset) {
            const utcDate = new Date(utcTimestamp); // Корректируем таймстамп на локальное время
            let localDateString = utcDate.toLocaleString() + ' UTC';
            const localDate = new Date(localDateString)            
            return {
                year: localDate.getFullYear(),
                month: localDate.getMonth(),
                day: localDate.getDate(),
                hours: localDate.getHours(),
                minutes: localDate.getMinutes() > 9 ? localDate.getMinutes() : "0" + localDate.getMinutes(),
            };
        }

    },
    // localDate in timestamp
    getFullDate(localDate) {
        return (new Date(localDate)).toLocaleDateString('ru-RU', {
            month: "numeric",
            day: 'numeric',
            hour: "numeric",
            minute: "numeric"
        })
    }
}