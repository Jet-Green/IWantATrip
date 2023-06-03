import $api from "../plugins/axios";

export default {
    fetchCompanions(lon = '', lat = '', query) {
        return $api.post(`/companion/get-all?lon=${lon}&lat=${lat}`, query)
    },
    searchCompanions(query) {
        return $api.post(`/companion/search`, query)
    },
    getById(_id) {
        return $api.get(`/companion/get-by-id?_id=${_id}`)
    },
    createCompanion(companion) {
        return $api.post('/companion/create', companion)
    },
    addFeedback(feedback, com_id) {
        return $api.post(`/companion/add-feedback?companion_id=${com_id}`, feedback)
    }

}