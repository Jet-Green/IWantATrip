import $api from "../plugins/axios";

export default class TripService {
    static async fetchTrips() {
        return $api.get('/trips/get-all')
    }
}