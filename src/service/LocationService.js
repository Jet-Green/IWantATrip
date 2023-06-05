import $api from "../plugins/axios";

export default {
    fetchLocations() {
        return $api.get('/location/get-all')
    },
    searchLocation(r) {
        return $api.get(`/location/search?name=${r}`)
    },
    selectUserLocation(location, userId) {
        return $api.post(`/location/select-user-location?user_id=${userId}`, location)
    }
}