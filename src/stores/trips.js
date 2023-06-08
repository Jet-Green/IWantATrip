import { defineStore } from 'pinia'

import { useAuth } from './auth'
import { useLocations } from './locations'

import BookingService from '../service/BookingService'
import TripService from '../service/TripService.js'

export const useTrips = defineStore('trips', {
    state: () => ({
        trips: [],
        cursor: 1,
        searchCursor: 1
    }),
    getters: {
        getTrips(state) {
            return state.trips
        },
    },
    actions: {
        async fetchTrips(query, start, end) {
            try {
                let locationStore = useLocations()
                let response;

                if (locationStore.location?.name) {
                    response = await TripService.fetchTrips(this.cursor, ...locationStore.location.coordinates, query, start, end);
                } else {
                    response = await TripService.fetchTrips(this.cursor, '', '', query, start, end);
                }

                this.trips.push(...response.data);

                if (response.data.length != 0)
                    this.cursor += 1
            } catch (err) {
                console.log(err);
            }
        },
        // async searchTrips(query, when) {
        //     try {
        //         if (!query && !when.start && !when.end) {
        //             if (!this.trips.length) {
        //                 this.filteredTrips = []
        //                 this.cursor = 0
        //                 this.trips = []
        //                 this.fetchTrips()
        //             }
        //         } else {
        //             this.trips = []
        //             const response = await TripService.searchTrips({ query, when: when }, this.searchCursor);

        //             this.filteredTrips.push(...response.data);

        //             if (response.data.length != 0)
        //                 this.searchCursor += 2
        //         }
        //     } catch (err) {
        //         console.log(err);
        //     }
        // },
        getById(_id) {
            return TripService.getById(_id)
        },
        deleteById(_id) {
            return TripService.deleteTrip({ _id: _id });
        },
        getCustomers(ids) {
            return TripService.getCustomers(ids)
        },
        findForModeration() {
            return TripService.findForModeration()
        },
        async moderateTrip(_id) {
            try {
                return await TripService.moderateTrip(_id)
            } catch (error) {
                console.log(error);
            }
        },
        async sendModerationMessage(trip_id, msg) {
            try {
                return await TripService.sendModerationMessage(trip_id, msg)
            } catch (error) {
                console.log(error);
            }
        },
        // когда открываем Созданные туры
        // Получает все туры, созданные пользователем
        async getCreatedTripsInfoByUserId(_id) {
            try {
                return await TripService.getCreatedTripsInfoByUserId(_id)
            } catch (error) {
                console.log(error);
            }
        },
        // когда переходим на страницу с покупателями туры
        async getFullTripById(_id) {
            try {
                return await TripService.getFullTripById(_id)
            } catch (error) {
                console.log(error);
            }
        },
        async setPayment(_id) {
            try {
                return await TripService.setPayment(_id)
            } catch (error) {
                console.log(error);
            }
        },
        async deletePayment(bill_id) {
            try {
                return await TripService.deletePayment(bill_id)
            } catch (error) {
                console.log(error);
            }
        },
        async getBookingTrips(status) {
            try {
                let res = await BookingService.getBookingTrips(status)
                return res.data
            } catch (error) {
                console.log(error);
            }
        },
        async changeBookStatus(_id, status) {
            try {
                let res = await BookingService.changeBookStatus(_id, status)
            } catch (error) {
                console.log(error);
            }
        }
    },
})