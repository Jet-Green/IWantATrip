import $api from "../plugins/axios";

export default {
    async registration(user) {
        return $api.post('/auth/registration', user)
    },
    async login(email, password) {
        return $api.post('/auth/login', { email, password })
    }
}