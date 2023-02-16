import { defineStore } from 'pinia'
import whereToGo from '../fakeDB/whereToGo.js'
import axios from 'axios'

import TripService from '../service/TripService.js'

export const useTrips = defineStore('trips', {
    state: () => ({
        trips: [],
        filteredTrips: [],
        whereToGo
    }),
    getters: {
        getTrips(state) {
            return state.trips
        },
        getFilteredTrips(state) {
            return state.filteredTrips
        },
        getWhereToGo(state) {
            return state.whereToGo
        },

    },
    actions: {
        async fetchTrips() {
            try {
                const response = await TripService.fetchTrips();
                this.trips = response.data;
            } catch (err) {
                console.log(err);
            }
        },
        async searchTrips(query, place, when) {
            try {
                const response = await TripService.searchTrips({ query, place: place, when: when });
                this.filteredTrips = response.data;
            } catch (err) {
                console.log(err);
            }
        },
        getById(_id) {
            return TripService.getById( _id )
        },
        deleteById(_id) {
            return TripService.deleteTrip({ _id: _id });
        },
        getCustomers(ids) {
            return TripService.getCustomers(ids)
        }
    },
})