import $api from "../plugins/axios";

export default {
  create(partner) {
    return $api.post('/partners/create', { partner })
  },
  deletePlace(id) {
    return $api.post('/partners/delete', { id })
  },
  async uploadPlaceImages(images) {
    return $api.post('/partners/upload-images', images)
  },
  getAll(page, query) {
    return $api.post('/partners/get-all', { page, query })
  },
  getPlacesForModeration(status) {
    return $api.get(`/partners/for-moderation?status=${status}`)
  },
  getById(_id) {
    return $api.get(`/partners/get-by-id?_id=${_id}`)
  },
  edit(partnerId, form) {
    return $api.post(`/partners/edit`, { partnerId, form })
  },
  getForCreateTrip() {
    return $api.get('/partners/for-create-trip')
  }
}