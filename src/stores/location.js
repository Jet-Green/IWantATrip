import { defineStore } from 'pinia'
import LocationService from '../service/UserService'
import axios from 'axios'

export const useLocation = defineStore('location', {
    state: () => ({
        location: {}
    }),
    getters: {

    },
    actions: {
    },
})