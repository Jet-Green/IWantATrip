import $api from "../plugins/axios";

export default {
    getAppState() {
        return $api.get('/app-state/app-state')
    },

    async setTripType(type) {
        return $api.post('/app-state/set-trip-type', { type })
    },
    deleteTripType(name) {
        return $api.post('/app-state/delete-trip-type', { name })
    }
}