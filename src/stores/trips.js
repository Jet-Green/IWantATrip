import { defineStore } from 'pinia'

import axios from 'axios'

import TripService from '../service/TripService.js'

export const useTrips = defineStore('trips', {
    state: () => ({
        trips: [],
        filteredTrips: [],
        cursor: 0
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
                const response = await TripService.fetchTrips(this.cursor);
                this.trips.push(...response.data);
            } catch (err) {
                console.log(err);
            }
        },
        async searchTrips(query, place, when) {
            try {
                if (!(query, place, when)) {
                    this.filteredTrips = []
                } else {
                    const response = await TripService.searchTrips({ query, place: place, when: when });
                    this.filteredTrips = response.data;
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