import $api from "../plugins/axios";

export default {
  create(place) {
    return $api.post('/places/create', { place })
  },
  async uploadPlaceImages(images) {
    return $api.post('/places/upload-images', images)
  },
}