import { defineStore } from 'pinia'
import AppService from '../service/AppService';
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
                        for (let i = 0; i < this.appState[0].tripType.length; i++) {
                            if (this.appState[0].tripType[i] == name) {
                                this.appState[0].tripType.splice(i, 1);
                            }
                        }
                    }
                    return res
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
})