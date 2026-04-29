import $api from "../plugins/axios"

export default {
    getPhotos(page) {
        return $api.get(`/photos/get-photos?page=${page}` )
    },

    uploadPhotobankPhotos(formData) {
        return $api.post(`/photos/upload-photobank`, formData)
    }
}