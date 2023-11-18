import { defineStore } from 'pinia'
import AppService from '../service/AppService';
import { number } from 'yup';
// import { message } from 'ant-design-vue';

export const useAppState = defineStore('app-state', {
    state: () => ({
        appState: null
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
     
    },
})