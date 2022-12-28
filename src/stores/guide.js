import { defineStore } from 'pinia'

import GuideService from '../service/GuideService.js'

export const useGuide = defineStore('guide', {
    state: () => ({
        watch: []
    }),
    getters: {

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