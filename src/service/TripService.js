import $api from "../plugins/axios";

export default {
    async fetchTrips() {
        return $api.get('/trips/get-all')
    },

    async createTrip(trip) {
        return $api.post('/trips/create', trip)
    }
}