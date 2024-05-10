import $api from "../plugins/axios"

export default {
    get() {
        return $api.get('/bus/get')
    },
    getById(_id) {
        return $api.get('/bus/get-by-id', { params: { _id } })
    },
    createBus(bus) {
        return $api.post('/bus/create', bus)
    }
}