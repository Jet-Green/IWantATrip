import { defineStore } from 'pinia'

import { useAuth } from './auth'

import TripService from '../service/TripService.js'

export const useTrips = defineStore('trips', {
    state: () => ({
        trips: [],
        filteredTrips: [],
        cursor: 0,
        searchCursor: 0
    }),
    getters: {
        getTrips(state) {
            return state.trips
        },
        getFilteredTrips(state) {
            return state.filteredTrips
        },
    },
    actions: {
        async fetchTrips() {
            try {
                if (this.filteredTrips.length == 0) {
                    this.searchCursor = 0
                    let userStore = useAuth()
                    const response = await TripService.fetchTrips(this.cursor, userStore.user?.userLocation?.geo_lat, userStore.user?.userLocation?.geo_lon);
                    this.trips.push(...response.data);

                    if (response.data.length != 0)
                        this.cursor += 20
                }
            } catch (err) {
                console.log(err);
            }
        },
        async searchTrips(query, place, when) {
            try {
                if (!query && !place && !when.start && !when.end) {
                    if (!this.trips.length) {
                        this.filteredTrips = []
                        this.cursor = 0
                        this.trips = []
                        this.fetchTrips()
                    }
                } else {
                    this.trips = []
                    const response = await TripService.searchTrips({ query, place: place, when: when }, this.searchCursor);

                    this.filteredTrips.push(...response.data);

                    if (response.data.length != 0)
                        this.searchCursor += 20
                }
            } catch (err) {
                console.log(err);
            }
        },
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
        }
    },
})