import $api from "../plugins/axios";

export default {
    async fetchCompanions() {
        return $api.get('/companion/get-all')
    },
    async createCompanion(companion) {
        return $api.post('/companion/create', companion)
    }
}