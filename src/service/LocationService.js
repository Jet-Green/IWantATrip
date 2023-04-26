import $api from "../plugins/axios";

export default {
    searchLocation(r) {
        return $api.get(`/location/search?name=${r}`)
    }
}