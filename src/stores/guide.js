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
        },
        async addTaxi(taxi) {
            try {
                let res = await GuideService.setTaxi(taxi)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async getLocalTaxi(location) {
            try {
                let res = await GuideService.getLocalTaxi(location)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async deleteTaxi(_id) {
            try {
                if (_id) {
                    let res = await GuideService.deleteTaxi(_id)
                    if (res.status == 200) {
                        await this.refreshState();
                    }
                    return res
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
})