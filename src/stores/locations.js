import { defineStore } from 'pinia'

import { useAuth } from './auth'

import LocationService from '../service/LocationService'

export const useLocations = defineStore('locations', {
    state: () => ({
        locations: [],
        location: {}
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
        /*  newLocation:
            _id
            name
            shortName 
            coordinates
        */
        async setLocation(newLocation) {
            let userStore = useAuth()
            let localLocation = localStorage.getItem('location')
            let isAuth = userStore.isAuth
            if (newLocation) {
                if (localLocation && isAuth) {
                    await userStore.selectUserLocation(newLocation)
                    this.location = userStore.user.userLocation
                    localStorage.setItem('location', JSON.stringify(userStore.user.userLocation))
                } else if (localLocation && !isAuth) {
                    this.location = newLocation
                    localStorage.setItem('location', JSON.stringify(newLocation))
                } else if (!localLocation && isAuth) {
                    await userStore.selectUserLocation(newLocation)
                    this.location = userStore.user.userLocation
                    localStorage.setItem('location', JSON.stringify(userStore.user.userLocation))
                } else if (!localLocation && !isAuth) {
                    this.location = newLocation
                    localStorage.setItem('location', JSON.stringify(newLocation))
                }
            } else {
                if (localLocation && isAuth) {
                    localStorage.setItem('location', JSON.stringify(userStore.user.userLocation))
                    this.location = userStore.user.userLocation
                } else if (localLocation && !isAuth) {
                    this.location = JSON.parse(localLocation)
                } else if (!localLocation && isAuth) {
                    localStorage.setItem('location', JSON.stringify(userStore.user.userLocation))
                    this.location = userStore.user.userLocation
                }
            }
        },
        async resetLocation() {
            let userStore = useAuth()
            await userStore.selectUserLocation({})
            localStorage.setItem('location', JSON.stringify({}))
            this.location = {}
        }
    }
})