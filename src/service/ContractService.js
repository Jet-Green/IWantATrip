import $api from "../plugins/axios";

export default {
    deleteContract(_id) {
        return $api.post(`/contract/delete`, { _id: _id })
    },
    registerContract(newContract, userEmail) {
        return $api.post(`/contract/register`, { contract: newContract, userEmail: userEmail })
    },
    createContract(contractId, userEmail, shopInfo) {
        return $api.post(`/contract/create`, { contractId: contractId, userEmail: userEmail, shopInfo: shopInfo })
    },
    getAll() {
        return $api.post('/contract/get-all')
    },
    addContractEmail(body) {
        return $api.put('/contract/contract-email', body)
    },
    deleteContractEmail(contractId, contractEmail) {
        return $api.delete(`/contract/contract-email?_id=${contractId}&email=${contractEmail}`)
    },
    getContractById(_id) {
        return $api.get(`/contract?_id=${_id}`)
    },
    getContractByShopCode(shopCode) {
        return $api.get(`/contract/byShopCode?shopCode=${shopCode}`)
    }
}