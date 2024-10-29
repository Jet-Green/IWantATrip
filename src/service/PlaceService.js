import $api from "../plugins/axios";

export default {
  create(place) {
    return $api.post('/places/create', { place })
  },
  async uploadPlaceImages(images) {
    return $api.post('/places/upload-images', images)
  },
  getAll(filter) {

    return $api.post('/places/get-all', {filter})
  },
  getPlacesForModeration(status) {
    return $api.get(`/places/for-moderation?status=${status}`)
  },
  getById(_id) {
    return $api.get(`/places/get-by-id?_id=${_id}`)
  }
}