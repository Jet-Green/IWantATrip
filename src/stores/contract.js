import { defineStore } from 'pinia'
// import { message } from 'ant-design-vue';
import ContractService from '../service/ContractService.js'

export const useContract = defineStore('contract', {
    state: () => ({
    }),
    getters: {
    },
    actions: {
        async createContract(newContract) {
            let res = await ContractService.createContract(newContract)
            return res
        }
    }
})