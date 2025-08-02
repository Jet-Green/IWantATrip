import { update } from "lodash";
import $api from "../plugins/axios";

export default {
    async fetchElementsByQuery(name) {
        return $api.get(`/guide/get-all-elements?name=${name}`)
    },

    // async deleteGuide(_id) {
    //     // guide elements
    //     return $api.post('/guide/delete-by-id', _id)
    // },
    async deleteGuideById(_id) {
        return $api.post('/guide/delete-by-id', { _id })
    },
    async createGuideElement(element) {
        return $api.post('/guide/create-element', element)
    },

    async uploadGuideElementImage(image) {
        return $api.post('/guide/upload-image', image)
    },
    async setTaxi(taxi) {
        return $api.post('/guide/set-taxi', { taxi })
    },
    async deleteTaxi(_id) {
        return $api.post('/guide/delete-taxi', { _id })
    },
    async getLocalTaxi(location) {
        return $api.post('/guide/get-local-taxi', { location })
    },
    async addGuide(guide) {
        return $api.post('/guide/add-guide', { guide })
    },
    async getGuides(page, filter) {
        return $api.post('/guide/get-guides', { page, filter })
    },
    async getGuidesByUserId(page, query) {
        return $api.post('/guide/get-guides-by-user-id', { page, query})
    },
    async uploadGuideImage(image) {
        return $api.post('/guide/upload-images', image)
    },
    async getGuideByEmail(email) {
        return $api.post('/guide/get-guide-by-email', { email })
    },
    async getGuideById(_id) {
        return $api.post('/guide/get-guide-by-id', { _id })
    },
    async getGuideExcursions(_id) {
        return $api.post('/guide/get-guide-excursions', { _id })
    },
    async moderateGuide(_id) {
        return $api.post('/guide/moderate-guide', { _id })
    },
    async hideGuide(_id, isHidden) {
        return $api.post('/guide/hide-guide', { _id, isHidden })
    },
    async sendGuideModerationMessage(_id, msg) {
        return $api.post('/guide/send-guide-moderation-message', { _id, msg })
    },
    async getGuidesAutocomplete(query) {
        return $api.post('/guide/get-guides-autocomplete', { query })
    },
    async updateGuide(guide) {
        return $api.post('/guide/update-guide', { guide })
    },
}