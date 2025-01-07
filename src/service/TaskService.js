import $api from "../plugins/axios";

export default {
  create(task) {
    return $api.post('/tasks/create', { task })
  },
  deletePlace(id) {
    return $api.post('/tasks/delete', { id })
  },
  async uploadPlaceImages(images) {
    return $api.post('/tasks/upload-images', images)
  },
  getAll(page, query) {
    return $api.post('/tasks/get-all', { page, query })
  },
  getTasksAmount(query) {
    return $api.post('/tasks/get-tasks-amount', { query })
  },
  getPlacesForModeration(status) {
    return $api.get(`/tasks/for-moderation?status=${status}`)
  },
  getById(_id) {
    return $api.get(`/tasks/get-by-id?_id=${_id}`)
  },
  edit(taskId, form) {
    return $api.post(`/tasks/edit`, { taskId, form })
  },
  getForCreateTrip() {
    return $api.get('/tasks/for-create-trip')
  },
  createInteraction(body) {
    return $api.post('/tasks/create-interaction', body)
  },
  deleteManager(body) {
    return $api.post('/tasks/delete-manager', body)
  },
  addPayment(payment, taskId) {
    return $api.post('/tasks/add-payment', {
      payment, taskId
    })
  },
  changeStatus(body) {
    return $api.post('/tasks/change-status', body)
  },
  edit(body) {
    return $api.post('/tasks/edit', body)
  }
}