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
        async bookingTrip(form) {
            try {
                const emailHtml = await render(BookingTripTemplate, { form });
                return BookingService.bookingTrip(emailHtml, form)
            } catch (err) {
                console.log(err);
            }
        }
    },
})