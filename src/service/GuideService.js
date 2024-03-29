import $api from "../plugins/axios";

export default {
    async fetchElementsByQuery(name) {
        return $api.get(`/guide/get-all-elements?name=${name}`)
    },

    async deleteGuide(_id) {
        return $api.post('/guide/delete-by-id', _id)
    },

    async createGuideElement(element) {
        return $api.post('/guide/create-element', element)
    },

    async uploadGuideElementImage(image) {
        return $api.post('/guide/upload-image', image)
    },
    async setTaxi(taxi) {
        return $api.post('/guide/set-taxi', { taxi})
    },
    async deleteTaxi(_id) {
        return $api.post('/guide/delete-taxi', { _id })
    },
    async getLocalTaxi(location) {
        return $api.post('/guide/get-local-taxi', {location})
    },
}