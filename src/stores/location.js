import { defineStore } from 'pinia'
import LocationService from '../service/UserService'
import axios from 'axios'

export const useGuide = defineStore('location', {
    state: () => ({
        location: []
    }),
    getters: {

    },
    actions: {
        async getLocations() {
            try {
                return LocationService.getLocations()
            } catch (err) {
                console.log(err);
            }
        }
    },
})