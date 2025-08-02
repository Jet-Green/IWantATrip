import { defineStore } from 'pinia'
import _ from 'lodash'
import GuideService from '../service/GuideService.js'

export const useGuide = defineStore('guide', {
    state: () => ({
        guides: [],
        isFetching: false,
        filter: {
            search:"",
            location:{
                name:"",
                shortName:"",
                type:"Point",
                coordinates:[]
            },
            locationRadius: 0,
            isHidden:false,
            isModerated: true,
            isRejected: false,
        }
    }),
    getters: {

    },
    actions: {
        // Это отнисится к гайдам
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

        // Это отнисится к гидам
        async addGuide(guide) {
            try {
                let res = await GuideService.addGuide(guide)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async getGuides(page, filter) {
            if (page == 1) {
                this.guides = [];
            }
            try {
                if (!this.isFetching) {
                    this.isFetching = true
                    let response = await GuideService.getGuides(
                        page, filter
                );
                this.isFetching = false
                
                this.guides.push(...response.data);
                this.guides = _.uniqBy(this.guides, '_id')
                return this.guides
                }
            } catch (err) {
                console.log(err);
            }
        },
        async getGuidesByUserId(page, query) {
            try {
                let res = await GuideService.getGuidesByUserId(page, query)
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
                // console.log(image.getAll('guide-image'))
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
        async getGuideById(_id) {
            try {
                let res = await GuideService.getGuideById(_id)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async getGuideExcursions(_id) {
            try {
                let res = await GuideService.getGuideExcursions(_id)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async moderateGuide(_id) {
            try {
                let res = await GuideService.moderateGuide(_id)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async hideGuide(_id, isHidden) {
            try {
                let res = await GuideService.hideGuide(_id, isHidden)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async sendGuideModerationMessage(_id, msg) {
            try {
                let res = await GuideService.sendGuideModerationMessage(_id, msg)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async deleteGuideById(_id) {
            try {
                let res = await GuideService.deleteGuideById(_id)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async getGuidesAutocomplete(query) {
            try {
                let res = await GuideService.getGuidesAutocomplete(query)
                return res
            } catch (error) {
                console.log(error);
            }
        }
    },
})