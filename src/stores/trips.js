import { defineStore } from 'pinia'

import { useAuth } from './auth'
import { useLocations } from './locations'

import TripService from '../service/TripService.js'

export const useTrips = defineStore('trips', {
    state: () => ({
        trips: [],
        filteredTrips: [],
        cursor: 1,
        searchCursor: 1
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

                    let locationStore = useLocations()
                    let response;
                    if (locationStore.location?.name) {
                        response = await TripService.fetchTrips(this.cursor, locationStore.location.geo_lat, locationStore.location.geo_lon);
                    } else {
                        response = await TripService.fetchTrips(this.cursor, '', '');
                    }

                    this.trips.push(...response.data);

                    if (response.data.length != 0)
                        this.cursor += 1
                }
            } catch (err) {
                console.log(err);
            }
        },
        async searchTrips(query, when) {
            try {
                if (!query && !when.start && !when.end) {
                    if (!this.trips.length) {
                        this.filteredTrips = []
                        this.cursor = 0
                        this.trips = []
                        this.fetchTrips()
                    }
                } else {
                    this.trips = []
                    const response = await TripService.searchTrips({ query, when: when }, this.searchCursor);

                    this.filteredTrips.push(...response.data);

                    if (response.data.length != 0)
                        this.searchCursor += 2
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
        },
        async sendModerationMessage(trip_id, msg) {
            try {
                return await TripService.sendModerationMessage(trip_id, msg)
            } catch (error) {
                console.log(error);
            }
        },
        async getCreatedTripsInfoByUserId(_id) {
            try {
                return await TripService.getCreatedTripsInfoByUserId(_id)
            } catch (error) {
                console.log(error);
            }
        }
    },
})