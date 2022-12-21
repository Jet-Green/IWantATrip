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
        }
    },
})