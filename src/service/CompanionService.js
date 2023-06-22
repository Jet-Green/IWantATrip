import $api from "../plugins/axios";

export default {
    fetchCompanions(lon = '', lat = '', query) {
        return $api.post(`/companion/get-all?lon=${lon}&lat=${lat}`, query)
    },
    getById(_id) {
        return $api.get(`/companion/get-by-id?_id=${_id}`)
    },
    createCompanion(companion, emailHtml) {
        return $api.post('/companion/create', { companion, emailHtml })
    },
    addFeedback(feedback, com_id) {
        return $api.post(`/companion/add-feedback?companion_id=${com_id}`, feedback)
    },
    getCompanionsOnModeration() {
        return $api.get('/companion/get-companions-on-moderation')
    },
    acceptCompanion(_id) {
        return $api.get(`/companion/accept-companion?_id=${_id}`)
    },
    deleteCompanion(_id) {
        return $api.get(`/companion/delete-by-id?_id=${_id}`)
    }
}