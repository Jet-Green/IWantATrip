import $api from "../plugins/axios";

export default {
    getPosters() {
        return $api.get('/posters/get-all')
    },
}