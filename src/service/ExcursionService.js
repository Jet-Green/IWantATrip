import $api from "../plugins/axios";

export default {
    create(body) {
        return $api.post('/excursion', body)
    }
}