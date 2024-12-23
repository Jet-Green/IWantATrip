import $api from "../plugins/axios";

export default {
    getAppState() {
        return $api.get('/app-state/app-state')
    },
    

    async addPlaceCategory(category) {
        return $api.post('/app-state/add-place-category', { category })
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
    },
    addTripRegion(tripRegion) {
        return $api.post('/app-state/trip-region', { tripRegion })
    },
    deleteTripRegion(tripRegion) {
        return $api.post('/app-state/delete-trip-region', { tripRegion })
    },
    deletePlaceCategory(category) {
        return $api.post('/app-state/delete-place-category', { category })
    },

    
}