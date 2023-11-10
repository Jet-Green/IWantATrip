import { defineStore } from 'pinia'
// import { message } from 'ant-design-vue';
import ContractService from '../service/ContractService.js'

export const useContract = defineStore('contract', {
    state: () => ({
        contracts: []
    }),
    getters: {
    },
    actions: {
        async createContract(newContract, userEmail) {
            let res = await ContractService.createContract(newContract, userEmail)
            return res
        },
        async getAll() {
            let res = await ContractService.getAll()

            this.contracts = res.data

            return res
        }
    }
})