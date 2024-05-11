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
    getAll(locationId) {
        return $api.post('/excursion/all', {locationId:locationId})
    },
    getExcursionById(_id) {
        return $api.get(`/excursion/one?_id=${_id}`)
    },
    deleteTime(dateId, timeId) {
        return $api.post('/excursion/delete-time', { dateId: dateId, timeId: timeId })
    },
    deleteDate(dateId, userId) {

        return $api.post('/excursion/delete-date', { dateId: dateId, userId: userId })
    },

    uploadImages(data) {
        return $api.post('/excursion/images', data)
    },
    deleteById(_id) {
        return $api.post('/excursion/delete-by-id', { _id: _id })
    },
    hideExcursion(_id, isHide) {
        return $api.post('/excursion/hide-by-id', { _id: _id, isHide: isHide })
    },
    buy(timeId, userId, toSend) {
        return $api.post('/excursion/buy', { timeId, userId, bill: toSend })
    },
    getExcursionsOnModeration() {
        return $api.get('/excursion/get-on-moderation')
    },
    deleteExcursion(_id) {
        return $api.post('/excursion/delete-excursion', { _id: _id })
    },
    approvExcursion (_id) {
        return $api.post('/excursion/approv-excursion', { _id: _id })
    }
}