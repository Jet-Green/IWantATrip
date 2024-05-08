import $api from "../plugins/axios";

export default {
    create(body) {
        return $api.post('/excursion', body)
    },
    getUserExcursions(userId) {
        return $api.get(`/excursion/get-excursions?user_id=${userId}`)
    },
    getById(_id) {
        return $api.get(`/excursion?_id=${_id}`)
    },
    createDates(dates, _id, userId) {
        return $api.post(`/excursion/dates`, { dates, excursionId: _id, userId })
    },
    getAll() {
        return $api.post('/excursion/all')
    },
    getExcursionById(_id) {
        return $api.get(`/excursion/one?_id=${_id}`)
    },
    uploadImages(data) {
        return $api.post('/excursion/images', data)
    },
    deleteById(_id){
       return $api.post('/excursion/delete-by-id', {_id : _id}) 
    }
    
}