import $api from "../plugins/axios";

export default {
    async createCompanion(companion) {
        return $api.post('/companion/create', companion)
    }
}