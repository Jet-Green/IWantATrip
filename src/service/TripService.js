import $api from "../plugins/axios";

export default {
    async fetchTrips() {
        return $api.get('/trips/get-all')
    },
    async searchTrips(query) {
        return $api.get(`/trips/search?query=${query}`)
    },

    async deleteTrip(_id) {
        return $api.post('/trips/delete-by-id', _id)
    },

    async createTrip(trip) {
        return $api.post('/trips/create', trip)
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
    }
}