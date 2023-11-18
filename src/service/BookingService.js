import $api from "../plugins/axios";

export default {
    async bookingTrip(emailHtml, booking) {
        return $api.post('/booking/create', { emailHtml, booking })
    },
    findByUserId(id) {
        return $api.post('/booking/findByUserId', { _id: id })
    },
    getBookingTrips(status) {
        return $api.get(`/booking/get-by-status?status=${status}`)
    },
    changeBookStatus(_id, status) {
        return $api.get(`/booking/change-status?_id=${_id}&status=${status}`)
    },
    updateBooking(booking) {
        return $api.post('/booking/update-booking', booking)
    },
    offerTrip(offer, bookingId) {
        return $api.post(`/booking/offer-trip`, { offer, bookingId })
    },
    getOffersByBookingId(booking_id) {
        return $api.post(`/booking/offers?booking_id=${booking_id}`)
    },
    acceptOffer(bookingId, offerId, client) {
        return $api.post('/booking/accept-offer', { bookingId, offerId, client })
    }
}