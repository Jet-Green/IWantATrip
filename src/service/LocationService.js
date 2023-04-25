import $api from "../plugins/axios";

export default {
    async getLocations() {
        return $api.get('/location/get-all')
    },
}