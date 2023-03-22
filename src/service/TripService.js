import $api from "../plugins/axios";

export default {
    async getCustomers(ids) {
        return $api.post('/trips/get-customers', ids)
    },
    async fetchTrips(query, cursor, limit) {
        return $api.post(`/trips/get-all?cursor=${cursor}&?limit=${limit}`, query)
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

    async bookingTrip(booking) {
        return $api.post('/trips/booking', booking)
    },

    async hideTrip(_id, v) {
        return $api.get(`/trips/hide?_id=${_id}&v=${v}`)
    },
    async clearTripsDB() {
        return $api.get('/trips/clear')
    },

}