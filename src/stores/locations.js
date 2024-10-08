import { defineStore } from 'pinia'

import { useAuth } from './auth'

import LocationService from '../service/LocationService'

export const useLocations = defineStore('locations', {
    state: () => ({
        locations: [],
        location: {},
        selectLocationDialog: false
    }),
    getters: {
        getLocations(state) {
            return state.locations
        },
        getLocation(state) {
            return state.location
        },
    },
    actions: {
        async fetchLocations() {
            try {
                const response = await LocationService.fetchLocations();
                this.locations = response.data;
            } catch (err) {
                console.log(err);
            }
        },
        /*  newLocation:
            _id
            name
            shortName 
            coordinates
        */
        async setLocation(newLocation) {

            localStorage.setItem('location', JSON.stringify(newLocation))
            this.location = newLocation
        },
        async refreshLocation() {
            this.location = JSON.parse(localStorage.getItem('location'))
        },
        async resetLocation() {
            localStorage.setItem('location', JSON.stringify({}))
            this.location = {}
        }
    }
})