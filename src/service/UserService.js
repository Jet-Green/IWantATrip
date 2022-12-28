import $api from "../plugins/axios";

export default {
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