import $api from "../plugins/axios";

export default {
    async createManyByDates(dates, parentId) {
        return $api.post('/trips/create-many-by-dates', { dates, parentId })
    },
    async getCustomers(ids) {
        return $api.post('/trips/get-customers', ids)
    },
    async fetchTrips(cursor, lon, lat, query, start, end, type, tripRegion, locationRadius, location) {
        return $api.get(`/trips/get-all?cursor=${cursor}&lon=${lon}&lat=${lat}&query=${query}&start=${start}&end=${end}&type=${type}&tripRegion=${tripRegion}&locationRadius=${locationRadius}&location=${location}`)
    },
    async fetchCatalogTrips(cursor, lon, lat, query = '', type = '') {
        return $api.get(`/catalog/get-all-catalog?cursor=${cursor}&lon=${lon}&lat=${lat}&query=${query}&type=${type}&tripRegion=${""}&locationRadius=${""}`)
    },
    async searchTrips(req, cursor) {
        return $api.post(`/trips/search?cursor=${cursor}`, req)
    },
    async findAuthorTrips(query, _id) {
        return $api.post('/trips/find-author-trips', { query, _id })
    },
    async getById(_id) {
        return $api.get(`/trips/get-by-id?_id=${_id}`)
    },
    async getMyCatalogTrips(id) {
        return $api.post('/catalog/get-my-catalog-trips', { id })
    },

    async deleteTrip(_id) {
        return $api.post('/trips/delete-by-id', _id)
    },
    async catalogToDelete(_id) {
        return $api.post('/catalog/delete-catalog-by-id', { '_id': _id })
    },

    async createTrip(emailHtml, trip, authorEmail, fullinfo) {
        return $api.post('/trips/create', { emailHtml, trip, emails: [authorEmail], fullinfo })
    },

    async createCatalogTrip(emailHtml, trip, authorEmail, fullinfo) {
        return $api.post('/catalog/create-catalog-trip', { emailHtml, trip, emails: [authorEmail], fullinfo })
    },

    async updateTrip(trip) {
        return $api.post('/trips/update', trip)
    },

    async uploadTripImages(images) {
        return $api.post('/trips/upload-images', images)
    },

    async uploadCatalogTripImages(images) {
        return $api.post('/catalog/upload-catalog-images', images)
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
    hideCatalogTrip(_id, v) {
        return $api.get(`/catalog/hide-catalog?_id=${_id}&v=${v}`)
    },
    async clearTripsDB() {
        return $api.get('/trips/clear')
    },
    findCatalogTrips() {
        return $api.get('/catalog/catalog-trips')
    },
    findRejectedCatalog() {
        return $api.get('/admin/rejected-catalog-trips')
    },
    findCatalogForModeration() {
        return $api.get('/admin/catalog-trips-on-moderation')
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
    moderateCatalogTrip(_id) {
        return $api.get(`/admin/moderate-catalog-trip?_id=${_id}`)
    },
    sendModerationMessage(trip_id, msg) {
        return $api.post(`/admin/send-moderation-message?tripId=${trip_id}`, { msg })
    },
    sendCatalogModerationMessage(trip_id, msg) {
        return $api.post(`/admin/send-catalog-moderation-message?tripId=${trip_id}`, { msg })
    },
    getCreatedTripsInfoByUserId(_id, query, search, page) {
        return $api.post(`/trips/created-trips-info`, { _id, query, search, page })
    },
    getFullTripById(_id) {
        return $api.get(`/trips/get-full-trip?_id=${_id}`)
    },
    getTripById(_id) {
        return $api.get(`/trips/get-trip-by-id?_id=${_id}`)
    },
    getFullCatalogById(_id) {
        return $api.get(`/catalog/get-full-catalog?_id=${_id}`)
    },
    getBoughtSeats(_id) {
        return $api.get('/trips/get-bought-seats', { params: { _id } })
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
    updatePartner(partner, trip_id, canSellPartnerTour) {
        return $api.post('/trips/update-partner', { partner: partner, _id: trip_id, canSellPartnerTour: canSellPartnerTour })
    },
    updateCatalogTrip(_id, trip) {
        return $api.post('/catalog/update-catalog-trip', { _id, trip })
    },
    editCatalogTrip(_id, trip) {
        return $api.post('/catalog/edit-catalog-trip', { _id, trip })
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
    },
    getCatalogTripById(catalogTripId) {
        return $api.get(`/catalog/catalog?_id=${catalogTripId}`)
    },
    moveToCatalog(tripId) {
        return $api.post('/catalog/move-to-catalog', { tripId })
    },
    getMyCatalogTripsOnModeration(id) {
        return $api.post('/catalog/my-catalog-on-moderation', { id })
    },
    addAdditionalService(tripId, service) {
        return $api.post('/trips/add-additional-service', { tripId, service })
    },
    deleteAdditionalService(tripId, serviceId) {
        return $api.post('/trips/delete-additional-service', { tripId, serviceId })
    },
}