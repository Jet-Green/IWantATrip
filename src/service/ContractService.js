import $api from "../plugins/axios";

export default {
    createContract(newContract, userEmail) {
        return $api.post(`/contract/create`, { contract: newContract, userEmail: userEmail })
    },
    getAll() {
        return $api.post('/contract/get-all')
    },
    addContractEmail(body) {
        return $api.put('/contract/contract-email', body)
    },
    deleteContractEmail(contractId, contractEmail) {
        return $api.delete(`/contract/contract-email?_id=${contractId}&email=${contractEmail}`)
    }
}