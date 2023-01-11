import { defineStore } from 'pinia'
import BookingService from '../service/BookingService';

export const useGuide = defineStore('guide', {
    state: () => ({
        booking: []
    }),
    getters: {

    },
    actions: {
        async createBookingElement(element) {
            try {
                return BookingService.createBookingElement(element)
            } catch (err) {
                console.log(err);
            }
        }
    },
})