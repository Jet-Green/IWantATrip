import { defineStore } from 'pinia'

import CompanionsService from '../service/CompanionService'
import { useLocations } from './locations'

import CreateCompanionTemplate from '../email-templates/CreateCompanionTemplate.vue'
import { render } from 'vue-email';

export const useCompanions = defineStore('companions', {
    state: () => ({
        companions: [],
        currentCompanion: {},
    }),
    getters: {
        getCompanions(state) {
            return state.companions
        },
    },
    actions: {
        async createCompanion(form) {
            const emailHtml = await render(CreateCompanionTemplate, { form });

            return CompanionsService.createCompanion(form, emailHtml)
        },
        async fetchCompanions(query) {
            try {
                let locationStore = useLocations()
                let response
                if (locationStore.location?.name) {
                    response = await CompanionsService.fetchCompanions(...locationStore.location.coordinates, query);
                } else {
                    response = await CompanionsService.fetchCompanions('', '', query);
                }

                this.companions = response.data;
            } catch (err) {
                console.log(err);
            }
        },
        async getCompanionsOnModeration() {
            try {
                return await CompanionsService.getCompanionsOnModeration()
            } catch (error) {
                console.log(error);
            }
        },
        // async searchCompanions(query) {
        //     try {
        //         const response = await CompanionsService.searchCompanions({ query });
        //         this.filteredСompanions = response.data;
        //     } catch (err) {
        //         console.log(err);
        //     }
        // },
        async getById(_id) {
            try {
                return CompanionsService.getById(_id);
            } catch (err) {
                console.log(err);
            }
        },
        async acceptCompanion(companionId) {
            try {
                return CompanionsService.acceptCompanion(companionId);
            } catch (err) {
                console.log(err);
            }
        },
        async deleteCompanion(_id, email) {
            try {
                return await CompanionsService.deleteCompanion(_id, email)
            } catch (error) {
                console.log(error);
            }
        }
    }
})