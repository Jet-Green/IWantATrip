import { defineStore } from 'pinia'
import AppService from '../service/AppService';

export const useAppState = defineStore('app-state', {
    state: () => ({
        appState: null,
        widgetIsMount: true,
        docLink:'',
    }),
    getters: {
    },
    actions: {
        async refreshState() {
            try {
                let { data } = await AppService.getAppState()
                this.appState = data;
            } catch (err) {
                console.log(err);
            }
        },
        async addTripType(name) {
            try {
                let res = await AppService.setTripType(name)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async deleteTripType(name) {
            try {
                if (name) {
                    let res = await AppService.deleteTripType(name)
                    if (res.status == 200) {
                        await this.refreshState();
                    }
                    return res
                }
            } catch (error) {
                console.log(error);
            }
        },
        async addTransportName(name) {
            try {
                let res = await AppService.setTransportName(name)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async deleteTransportName(name) {
            try {
                if (name) {
                    let res = await AppService.deleteTransportName(name)
                    if (res.status == 200) {
                        await this.refreshState();
                    }
                    return res
                }
            } catch (error) {
                console.log(error);
            }
        },
        async addExcursionType(body) {
            try {
                let res =  await AppService.addExcursionType(body)
                this.appState = [res.data]
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async deleteExcursionType(body) {
            try {
                let res = await AppService.deleteExcursionType(body)
                this.appState = [res.data]
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async addTripRegion(tripRegion) {
            try {
                let res = await AppService.addTripRegion(tripRegion)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async deleteTripRegion(tripRegion) {
            try {
                let res = await AppService.deleteTripRegion(tripRegion)
                return res
            } catch (error) {
                console.log(error);
            }
        },
    },
})