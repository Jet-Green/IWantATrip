import { defineStore } from 'pinia'
import whereToGo from '../fakeDB/whereToGo.js'
import axios from 'axios'

import TripService from '../service/TripService.js'

export const useTrips = defineStore('trips', {
    state: () => ({
        trips: [],
        whereToGo
    }),
    getters: {
        getTrips(state) {
            return state.trips
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
        getById(_id) {
            return axios.get(`${import.meta.env.VITE_API_URL}/trips/get-by-id?_id=${_id}`)
        },
        deleteById(_id) {
            return TripService.deleteTrip({ _id: _id });
        }
    },
})