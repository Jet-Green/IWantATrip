import $api from "../plugins/axios";

export default {
    fetchLocations() {
        return $api.get('/location/get-all')
    },
    searchLocation(r) {
        return $api.get(`/location/search?name=${r}`)
    },
    selectUserLocation(location, userId) {
        return $api.post(`/location/select-user-location?user_id=${userId}`, location)
    },
    createLocation(location) {
        return $api.post(`/location/create-location`, {location})
    },
    uploadImage(image) {
        return $api.post(`/location/upload-image`, image)
    },
    deletePhotoFromLocation(_id) {
          return $api.post(`/location/delete-photo`, {_id})
    }
}