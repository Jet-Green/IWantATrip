import $api from "../plugins/axios"

export default {
    getPhotos(page) {
        return $api.get(`/photos/get-photos?page=${page}` )
    }
}