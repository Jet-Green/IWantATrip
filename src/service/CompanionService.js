import $api from "../plugins/axios";

export default {
    fetchCompanions() {
        return $api.get('/companion/get-all')
    },
    getById(_id) {
        return $api.get(`/companion/get-by-id?_id=${_id}`)
    },
    createCompanion(companion) {
        return $api.post('/companion/create', companion)
    }
}