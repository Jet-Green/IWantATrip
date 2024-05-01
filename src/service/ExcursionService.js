import $api from "../plugins/axios";

export default {
    create(body) {
        return $api.post('/excursion', body)
    },
    getUserExcursions(userId) {
        return $api.get(`/excursion/get-excursions?user_id=${userId}`)
    },
    getById(_id) {
        return $api.get(`/excursion?_id=${_id}`)
    },
    createDates(dates, _id, userId) {
        return $api.post(`/excursion/dates`, { dates, excursionId: _id, userId })
    },
    getAll() {
        return $api.post('/excursion/all')
    },
    getEDateById(_id) {
        return $api.get(`/excursion/date?_id=${_id}`)
    }
}