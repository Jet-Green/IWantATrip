import $api from "../plugins/axios"

export default {
    getPhotos(page) {
        return $api.get(`/photos/get-photos?page=${page}` )
    },

    searchPhotos(q, page) {
        const qq = encodeURIComponent(String(q ?? '').trim())
        const p = page ?? 1
        return $api.get(`/photos/search?q=${qq}&page=${p}`)
    },

    uploadPhotobankPhotos(formData) {
        return $api.post(`/photos/upload-photobank`, formData)
    }
}