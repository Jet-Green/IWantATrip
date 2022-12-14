import { defineStore } from 'pinia'

import CompanionsService from '../service/CompanionService'

export const useCompanions = defineStore('companions', {
    state: () => ({
        companions: [],
    }),
    getters: {
        getCompanions(state) {
            return state.companions
        },
    },
    actions: {
        async fetchCompanions() {
            try {
                const response = await CompanionsService.fetchCompanions();
                this.companions = response.data;
            } catch (err) {
                console.log(err);
            }
        },
        async getById(_id) {
            try {
                return CompanionsService.getById(_id);
            } catch (err) {
                console.log(err);
            }
        },
    }
})