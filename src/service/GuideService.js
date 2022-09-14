import $api from "../plugins/axios";

export default {
    async fetchElementsByQuery(name) {
        return $api.get(`/guide/get-all-elements?name=${name}`)
    },

    async createGuideElement(element, name) {
        return $api.post(`/guide/create-element?name=${name}`, element, { headers: { "Content-Type": 'multipart/form-data' } })
    }
}