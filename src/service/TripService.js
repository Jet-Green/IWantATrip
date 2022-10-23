import $api from "../plugins/axios";

export default {
    async fetchTrips() {
        return $api.get('/trips/get-all')
    },

    async createTrip(trip) {
        return $api.post('/trips/create', trip)
    },

    async uploadTripImages(images) {
        return $api.post('/trips/upload-images', images)
    },

    async bookingTrip(booking) {
        return $api.post('/trips/booking', booking)
    },
    async clearTripsDB() {
        return $api.get('/trips/clear')
    }
}