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
    },
    async setTransportName(name) {
        return $api.post('/app-state/set-transport-name', { name })
    },
    deleteTransportName(name) {
        return $api.post('/app-state/delete-transport-name', { name })
    },
    addExcursionType(body) {
        return $api.put('/app-state/excursion-types', body)
    },
    async deleteExcursionType(body) {
        return $api.patch('/app-state/excursion-types', body)
    }
}