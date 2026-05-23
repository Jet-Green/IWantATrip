import $api from "../plugins/axios"

export default {
    getPhotos(page, geo) {
        const params = new URLSearchParams({ page: String(page ?? 1) })
        if (geo?.lon != null && geo?.lat != null) {
            params.set('lon', String(geo.lon))
            params.set('lat', String(geo.lat))
        }
        if (geo?.location) {
            params.set('location', String(geo.location))
        }
        if (geo?.locationRadius != null && geo?.locationRadius !== '') {
            params.set('locationRadius', String(geo.locationRadius))
        }
        return $api.get(`/photos/get-photos?${params.toString()}`)
    },

    searchPhotos(q, page, geo) {
        const qq = encodeURIComponent(String(q ?? '').trim())
        const p = page ?? 1
        const params = new URLSearchParams({ q: String(q ?? '').trim(), page: String(p) })
        if (geo?.lon != null && geo?.lat != null) {
            params.set('lon', String(geo.lon))
            params.set('lat', String(geo.lat))
        }
        if (geo?.location) {
            params.set('location', String(geo.location))
        }
        if (geo?.locationRadius != null && geo?.locationRadius !== '') {
            params.set('locationRadius', String(geo.locationRadius))
        }
        return $api.get(`/photos/search?${params.toString()}`)
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
