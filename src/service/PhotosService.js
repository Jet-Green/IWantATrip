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
    },

    findPhotosOnModeration() {
        return $api.get('/photos/on-moderation')
    },

    findRejectedPhotos() {
        return $api.get('/photos/rejected')
    },

    getPhotoById(_id) {
        return $api.get(`/photos/by-id?_id=${_id}`)
    },

    moderatePhoto(_id) {
        return $api.get(`/photos/moderate?_id=${_id}`)
    },

    rejectPhoto(_id, msg) {
        return $api.post(`/photos/reject?_id=${_id}`, { msg })
    },

    deletePhoto(_id) {
        return $api.delete(`/photos/delete?_id=${_id}`)
    },

    getMyPhotos(status, page) {
        const st = encodeURIComponent(String(status ?? 'onModeration'))
        const p = page ?? 1
        return $api.get(`/photos/my-photos?status=${st}&page=${p}`)
    },

    deleteMyPhoto(_id) {
        return $api.delete(`/photos/my-photo?_id=${_id}`)
    },

    updateMyPhoto(_id, metadata) {
        const id = encodeURIComponent(String(_id ?? '').trim())
        return $api.post(`/photos/update-my-photo?_id=${id}`, metadata)
    },

    filterPublishedUrls(urls) {
        return $api.post('/photos/filter-published', { urls })
    },
}
