import $api from "../plugins/axios";

export default {
    create(body) {
        return $api.post('/excursion', body)
    },
    getUserExcursions(userId) {
        return $api.get(`/excursion/get-excursions?user_id=${userId}`)
    }
}