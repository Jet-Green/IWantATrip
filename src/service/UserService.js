import $api from "../plugins/axios";

export default {
    async registration(user) {
        return $api.post('/auth/registration', user)
    }
}