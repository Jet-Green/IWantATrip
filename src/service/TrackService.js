import $api from "../plugins/axios";

export default {
  create(track) {
    return $api.post('/tracks/create', { track })
  },
  deleteTrack(id) {
    return $api.post('/tracks/delete', { id })
  },
  getAll(page, query) {
    return $api.post('/tracks/get-all', { page, query })
  },
  getById(_id) {
    return $api.get(`/tracks/get-by-id?_id=${_id}`)
  },
  edit(toSend) {
    let trackId = toSend._id;
    delete toSend._id;
    return $api.post(`/tracks/edit`, { trackId, track: toSend })
  }
}
