import { defineStore } from 'pinia'

import LocationService from '../service/LocationService'

export const useLocations = defineStore('locations', {
    state: () => ({
        locations: [],
       
    }),
    getters: {
        getLocations(state) {
            return state.locations
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
   
    }
})