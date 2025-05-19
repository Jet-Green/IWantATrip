import $api from "../plugins/axios";

export default {
  create(place) {
    return $api.post('/places/create', { place })
  },
  deletePlace(id) {
    return $api.post('/places/delete', { id })
  },
  async uploadPlaceImages(images) {
    return $api.post('/places/upload-images', images)
  },
  getAll(page, query) {
    return $api.post('/places/get-all', { page, query })
  },
  getPlacesForModeration(status) {
    return $api.get(`/places/for-moderation?status=${status}`)
  },
  getById(_id) {
    return $api.get(`/places/get-by-id?_id=${_id}`)
  },
  moderatePlace(_id) {
    return $api.get(`/places/moderate-place?_id=${_id}`)
  },
  rejectPlace(_id) {
    return $api.get(`/places/reject-place?_id=${_id}`)
  },
  hidePlace(_id) {
    return $api.get(`/places/hide-place?_id=${_id}`)
  },
  edit(toSend) {
    let placeId = toSend._id;
    delete toSend._id;
    return $api.post(`/places/edit`, { placeId, place: toSend })
  },
  getForCreateTrip(search) {
    return $api.get(`/places/for-create-trip?search=${search}`)
  }
}