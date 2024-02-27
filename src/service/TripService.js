import $api from "../plugins/axios";

export default {
    async createManyByDates(dates, parentId) {
        return $api.post('/trips/create-many-by-dates', { dates, parentId })
    },
    async getCustomers(ids) {
        return $api.post('/trips/get-customers', ids)
    },
    async fetchTrips(cursor, lon, lat, query = '', start = '', end = '', type = '') {
        return $api.get(`/trips/get-all?cursor=${cursor}&lon=${lon}&lat=${lat}&query=${query}&start=${start}&end=${end}&type=${type}`)
    },
    async fetchCatalogTrips(cursor, lon, lat, query = '', type = '') {
        return $api.get(`/trips/get-all-catalog?cursor=${cursor}&lon=${lon}&lat=${lat}&query=${query}&type=${type}`)
    },
    async searchTrips(req, cursor) {
        return $api.post(`/trips/search?cursor=${cursor}`, req)
    },
    async getById(_id) {
        return $api.get(`/trips/get-by-id?_id=${_id}`)
    },

    async deleteTrip(_id) {
        return $api.post('/trips/delete-by-id', _id)
    },

    async createTrip(emailHtml, trip, authorEmail, fullinfo) {
        return $api.post('/trips/create', { emailHtml, trip, emails: [authorEmail], fullinfo })
    },

    async updateTrip(trip) {
        return $api.post('/trips/update', trip)
    },

    async uploadTripImages(images) {
        return $api.post('/trips/upload-images', images)
    },

    async uploadTripPdf(pdf) {
        return $api.post('/trips/upload-pdf', pdf)
    },

    async bookingTrip(booking) {
        return $api.post('/trips/booking', booking)
    },

    async hideTrip(_id, v) {
        return $api.get(`/trips/hide?_id=${_id}&v=${v}`)
    },
    async clearTripsDB() {
        return $api.get('/trips/clear')
    },
    findCatalogTrips() {
        return $api.get('/trips/catalog-trips')
    },
    getUserTrips(ids) {
        return $api.post(`/trips/get-user-trips`, ids)
    },
    findRejectedTrips() {
        return $api.get('/admin/rejected-trips')
    },
    findForModeration() {
        return $api.get('/admin/trips-on-moderation')
    },
    moderateTrip(_id) {
        return $api.get(`/admin/moderate-trip?_id=${_id}`)
    },
    sendModerationMessage(trip_id, msg) {
        return $api.post(`/admin/send-moderation-message?tripId=${trip_id}`, { msg })
    },
    getCreatedTripsInfoByUserId(_id) {
        return $api.get(`/trips/created-trips-info?_id=${_id}`)
    },
    getFullTripById(_id) {
        return $api.get(`/trips/get-full-trip?_id=${_id}`)
    },

    setPayment(bill) {
        return $api.post(`/trips/set-payment`, bill)
    },
    deletePayment(bill_id) {
        return $api.get(`/trips/delete-payment?_id=${bill_id}`)
    },
    updateTourists(bill) {
        return $api.post('/trips/update-bills-tourists', { _id: bill, touristsList: bill.touristsList })
    },
    updatePartner(partner, trip_id) {
        return $api.post('/trips/update-partner', { partner: partner, _id: trip_id })
    },
    updateIsCatalog(_id, isCatalog) {
        return $api.post('/trips/update-iscatalog', {_id: _id, isCatalog: isCatalog })
    },
    updateIncludedLocations(updateObject) {
        return $api.post('/trips/update-included-locations', updateObject)
    },
    updateTransports(updateObj) {
        return $api.post('/trips/update-transports', updateObj)
    },
    findTripByCustomerName(name, userId) {

        return $api.post('/trips/find-trip-by-name', { name: name, userId: userId })
    },
    setUserComment(body) {
        return $api.put('/trips/set-user-comment', body)
    },
    editUserComment(body) {
        return $api.put('/trips/bill-user-comment', body)
    },
    getBoughtTrips(userId) {
        return $api.get(`/trips/bought?userId=${userId}`)
    }
}