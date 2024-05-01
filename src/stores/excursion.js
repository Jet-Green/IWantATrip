import { defineStore } from 'pinia'
import ExcursionService from '../service/ExcursionService.js'

import { useAuth } from './auth.js'

export const useExcursion = defineStore('excursion', {
    state: () => ({
    }),
    getters: {
    },
    actions: {
        async create(excursion) {
            return await ExcursionService.create({ excursion, userId: useAuth().user._id })
        },
        async getUserExcursions() {
            const user = useAuth().user
            return await ExcursionService.getUserExcursions(user._id)
        },
        async getById(_id) {
            return await ExcursionService.getById(_id)
        },
        /** 
         * dates are from datePlugin.excursions.concatDateAndTime
         * _id is excursion _id
        */
        async createDates(dates, _id) {
            const userStore = useAuth()
            return await ExcursionService.createDates(dates, _id, userStore.user._id)
        }
    }
})