import { defineStore } from 'pinia'

import GuideService from '../service/GuideService.js'

export const useGuide = defineStore('guide', {
    state: () => ({
        toWatch: []
    }),
    getters: {
        getTrips(state) {
            return state.trips
        },
        getWhereToGo(state) {
            return state.whereToGo
        }
    },
    actions: {
        async fetchElementsByQuery(name) {
            try {
                const response = await GuideService.fetchElementsByQuery(name);

                console.log(response);

                this[name] = response.data;
            } catch (err) {
                console.log(err);
            }
        },
        async createGuideElement(element) {
            try {
                return GuideService.createGuideElement(element)
            } catch (err) {
                console.log(err);
            }
        }
    },
})