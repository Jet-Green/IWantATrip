import { defineStore } from 'pinia'

import axios from 'axios'

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
                    const response = await TripService.fetchTrips(this.cursor);
                    this.trips.push(...response.data);

                    if (response.data.length != 0)
                        this.cursor += 7
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
                        this.searchCursor += 7
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
        }
    },
})