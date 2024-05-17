import $api from "../plugins/axios";

export default {
    create(body) {
        return $api.post('/excursion/create', body)
    },
    edit(excursion) {
        return $api.post('/excursion/edit', { excursion })
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
        return $api.post('/excursion/all', { locationId: locationId })
    },
    getExcursionById(_id) {
        return $api.get(`/excursion/one?_id=${_id}`)
    },
    getExcursionBillsById(_id) {
        return $api.get(`/excursion/with-bills?_id=${_id}`)
    },
    deleteExcursionBill(_id) {
        return $api.get(`/excursion/delete-bill?_id=${_id}`)
    },

    getExcursionBookingsById(_id) {
        return $api.get(`/excursion/with-bookings?_id=${_id}`)
    },
    getTimeCustomers(excursionId, timeId) {
        return $api.post('/excursion/time-customers', { excursionId, timeId })
    },
    getTimeBookings(excursionId, timeId) {
        return $api.post('/excursion/time-bookings', { excursionId, timeId })
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
    buyFromCabinet(timeId, toSend, fullinfo) {
        return $api.post('/excursion/buy-from-cabinet', { timeId, fullinfo, bill: toSend })
    },
    bookFromCabinet(body) {
        return $api.post('/excursion/book-from-cabinet', body)
    },
    book(body) {
        return $api.post('/excursion/book', body)
    },
    getExcursionsOnModeration() {
        return $api.get('/excursion/get-on-moderation')
    },
    deleteExcursion(_id) {
        return $api.post('/excursion/delete-excursion', { _id: _id })
    },
    approvExcursion(_id) {
        return $api.post('/excursion/approv-excursion', { _id: _id })
    }
}