import { defineStore } from 'pinia'
import BookingService from '../service/BookingService';
import BookingTripTemplate from '../email-templates/BookingTripTemplate.vue';

import { render } from 'vue-email';

export const useBooking = defineStore('booking', {
    state: () => ({
    }),
    getters: {

    },
    actions: {
        async bookingTrip(booking) {
            try {
                const emailHtml = await render(BookingTripTemplate, { form: booking });
                return BookingService.bookingTrip(emailHtml, booking)
            } catch (err) {
                console.log(err);
            }
        },
        async offerTrip(offer, bookingId) {
            try {
                return await BookingService.offerTrip(offer, bookingId)
            } catch (error) {
                console.log(error);
            }
        },
        async getOffersByBookingId(booking_id, status) {
            try {
                let res = await BookingService.getOffersByBookingId(booking_id, status)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async acceptOffer(bookingId, offerId, client) {
            try {
                let res = await BookingService.acceptOffer(bookingId, offerId, client)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async rejectOffer(bookingId, offerId, client) {
            try {
                let res = await BookingService.rejectOffer(bookingId, offerId, client)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async toNewOffer(bookingId, offerId, client) {
            try {
                let res = await BookingService.toNewOffer(bookingId, offerId, client)
                return res
            } catch (error) {
                console.log(error);
            }
        },
    },
})