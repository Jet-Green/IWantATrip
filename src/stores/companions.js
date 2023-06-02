import { defineStore } from 'pinia'

import CompanionsService from '../service/CompanionService'
import { useLocations } from './locations'

export const useCompanions = defineStore('companions', {
    state: () => ({
        companions: [],
        filteredСompanions: [],
        currentCompanion: {},

    }),
    getters: {
        getCompanions(state) {
            return state.companions
        },
    },
    actions: {
        async fetchCompanions() {
            try {
                let locationStore = useLocations()
                let response
                if (locationStore.location?.name) {
                    response = await CompanionsService.fetchCompanions(...locationStore.location.coordinates);
                } else {
                    response = await CompanionsService.fetchCompanions();
                }

                this.companions = response.data;
            } catch (err) {
                console.log(err);
            }
        },
        async searchCompanions(query) {
            try {
                const response = await CompanionsService.searchCompanions({ query });
                this.filteredСompanions = response.data;
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