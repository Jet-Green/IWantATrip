import dayjs from 'dayjs'

export default {
    excursions: {
        /**
         * принимает dates в формате массива дат(dayjs) 
         * times в формате {hours: Number, minutes: Number, seconds: Number}
         * возвращает Array<Object> { date: String, time: Array<Object> }
         */
        concatDateAndTime(dates, times) {
            let res = []
            // если их длина не совпадает
            if (dates.length != times.length) return []

            for (let i = 0; i < dates.length; i++) {
                let date = dayjs(dates[i])
                res.push({
                    date: { year: date.$y, month: date.$M, day: date.$D },
                    time: times[i]
                })
            }

            return res
        }
    }
}