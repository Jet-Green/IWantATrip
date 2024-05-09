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

        /** 
         * dates are from datePlugin.excursions.concatDateAndTime
         * _id is excursion _id
        */
        async createDates(dates, _id) {
            const userStore = useAuth()
            return await ExcursionService.createDates(dates, _id, userStore.user._id)
        },
        async getAll() {
            return await ExcursionService.getAll()
        },
        // get excursionDate by id
        async getExcursionById(_id) {
            return await ExcursionService.getExcursionById(_id)
        },
        async deleteTime(dateId,timeId) {
            return await ExcursionService.deleteTime(dateId,timeId)
        },
        async deleteDate(dateId) {
            return await ExcursionService.deleteDate(dateId)
        },


        

        async uploadImages(data) {
            return await ExcursionService.uploadImages(data)
        },
        async deleteById (_id) {
            return await ExcursionService.deleteById(_id)
        },
        async hideExcursion (_id,isHide) {
            return await ExcursionService.hideExcursion(_id, isHide)
        }
        
    }
})