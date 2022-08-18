import { defineStore } from 'pinia'
import trips from '../fakeDB/trips.js'

export const useData = defineStore('data', {
    state: () => ({
        trips,
    }),
    getters: {
        getTrips(state) {
            return state.userStatus
        },
    },
    actions: {},
})