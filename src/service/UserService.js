import $api from "../plugins/axios";

export default {
    async buyTrip(_id, userEmail) {
        return $api.post('/auth/buy-trip', { _id, userEmail })
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