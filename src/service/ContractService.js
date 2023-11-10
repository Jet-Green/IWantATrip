import $api from "../plugins/axios";

export default {
    createContract(newContract, userEmail) {
        return $api.post(`/contract/create`, { contract: newContract, userEmail: userEmail })
    },
}