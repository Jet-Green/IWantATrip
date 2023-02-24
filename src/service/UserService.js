import $api from "../plugins/axios";

export default {
    async resetPassword(email) {
        return $api.post('/auth/forgot-password', { 'email': email })
    },
    async buyTrip(tripId, bill) {
        return $api.post(`/trips/buy-trip?_id=${tripId}`, bill)
    },
    async registration(user) {
        return $api.post('/auth/registration', user)
    },
    async login(email, password) {
        return $api.post('/auth/login', { email, password })
    },
    async logout() {
        return $api.post('/auth/logout')
    },
    async updateUser(user) {
        return $api.post('/auth/update', user)
    }
}