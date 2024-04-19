import $api from "../plugins/axios"

export default {
    get() {
        return $api.get('/bus/get')
    },
    createBus(bus) {
        return $api.post('/bus/create', bus)
    }
}