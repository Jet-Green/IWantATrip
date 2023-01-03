import $api from "../plugins/axios";

export default {
    createBookingElement(booking) {
        return $api.post('/booking/create', booking)
    }
}