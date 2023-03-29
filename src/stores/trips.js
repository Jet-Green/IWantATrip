import { defineStore } from 'pinia'
import * as _ from 'lodash'

import axios from 'axios'

import TripService from '../service/TripService.js'

export const useTrips = defineStore('trips', {
    state: () => ({
        // trips: [],
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
        async fetchTrips(query, place, when, limit = 5) {
            try {
                const response = await TripService.fetchTrips({ query, place: place, when: when }, this.cursor, limit);
                let tempTrips = this.filteredTrips.concat(response.data);
                this.filteredTrips = _.uniq(tempTrips)
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