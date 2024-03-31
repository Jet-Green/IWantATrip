import { defineStore } from 'pinia'
import { message } from 'ant-design-vue';
import ContractService from '../service/ContractService.js'
import tinkoffPlugin from '../plugins/tinkoff.js'

export const useContract = defineStore('contract', {
    state: () => ({
        contracts: [],
        editingContract: {},
    }),
    getters: {
    },
    actions: {
        async deleteContract(_id) {
            let res = await ContractService.deleteContract(_id)
            return res
        },
        async registerContract(newContract, userEmail) {
            let response = await ContractService.registerContract(newContract, userEmail)
            return response
        },
        setEditingContract(contract) {
            this.editingContract = contract
        },
        clearEditingContract() {
            this.editingContract = {}
        },


        async createContract(newContract, userEmail) {
            
            // let tinkoffRes = await tinkoffPlugin.registerShop(newContract)
            // console.log(tinkoffRes);
            // if (tinkoffRes.status != '200') {
            //     message.config({ duration: 10 });
            //     message.error({ content: tinkoffRes.data.errors });
            //     return
            // }

            // let shopInfo = tinkoffRes.data
            let shopInfo = {
                code: "1375669",
                shopCode: 1375669,
                terminals: []
            }

            let response = await ContractService.createContract(newContract._id, userEmail, shopInfo)
            return response
        },
        async getAll() {
            let res = await ContractService.getAll()

            this.contracts = res.data

            return res
        },
        async addContractEmail(contractId, contractEmail) {
            return await ContractService.addContractEmail({ contractId, contractEmail })
        },
        async deleteContractEmail(contractId, contractEmail) {
            return await ContractService.deleteContractEmail(contractId, contractEmail)
        }
    }
})