export default excursions = {
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
            res.append({
                date: dates[i],
                time: times[i]
            })
        }

        return res
    }
}