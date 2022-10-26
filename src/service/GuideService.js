import $api from "../plugins/axios";

export default {
    async fetchElementsByQuery(name) {
        return $api.get(`/guide/get-all-elements?name=${name}`)
    },

    async createGuideElement(element) {
        return $api.post('/guide/create-element', element)
    },

    async uploadGuideElementImage(image) {
        return $api.post('/guide/upload-image', image)
    }
}