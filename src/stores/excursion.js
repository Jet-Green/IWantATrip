import { defineStore } from 'pinia'
import ExcursionService from '../service/ExcursionService.js'

export const useExcursion = defineStore('excursion', {
    state: () => ({
    }),
    getters: {
    },
    actions: {
        async create(excursion) {
            return ExcursionService.create(excursion)
        }
    }
})