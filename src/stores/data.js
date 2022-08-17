import { defineStore } from 'pinia'
import trips from '../fakeDB/trips.js'
import whereToGo from '../fakeDB/whereToGo.js'

export const useData = defineStore('data', {
    state: () => ({
        trips,
        whereToGo
    }),
    getters: {
        getTrips(state) {
            return state.userStatus
        },
        getWhereToGo(state) {
            return state.whereToGo
        }
    },
    actions: {},
})