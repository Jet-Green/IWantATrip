import $api from "../plugins/axios"

export default {
    getPhotos() {
        return $api.get('/photos/get-photos' )
    }
}