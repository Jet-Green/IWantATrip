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
        },
        async addGuide(guide) {
            try {
                let res = await GuideService.addGuide(guide)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async getGuides(query,dbSkip) {
            try {
                let res = await GuideService.getGuides(query,dbSkip)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async updateGuide(guide) {
            try {
                let res = await GuideService.updateGuide(guide)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async uploadGuideImage(image) {
            try {
                console.log(image)
                let res = await GuideService.uploadGuideImage(image)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async getGuideByEmail(email) {
            try {
                let res = await GuideService.getGuideByEmail(email)
                return res
            } catch (error) {
                console.log(error);
            }
        },
    },
})