import $api from "../plugins/axios";

export default {
    async getCustomers(ids) {
        return $api.post('/trips/get-customers', ids)
    },
    async fetchTrips(cursor, geo_lat, geo_lon) {
        return $api.get(`/trips/get-all?cursor=${cursor}&geo_lat=${geo_lat}&geo_lon=${geo_lon}`)
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

    async createTrip(trip, authorEmail) {
        return $api.post('/trips/create', { trip, emails: [authorEmail] })
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


    findForModeration() {
        return $api.get('/admin/trips-on-moderation')
    },
    moderateTrip(_id) {
        return $api.get(`/admin/moderate-trip?_id=${_id}`)
    },
    sendModerationMessage(trip_id, msg) {
        return $api.post(`/admin/send-moderation-message?tripId=${trip_id}`, { msg })
    }

}