import $api from "../plugins/axios";

export default {
    bookingTrip(booking) {
        return $api.post('/booking/create', booking)
    },
    findByUserId(id) {
        return $api.post('/booking/findByUserId', {_id:id})
    }
}