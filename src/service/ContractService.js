import $api from "../plugins/axios";

export default {
    createContract(newContract) {
        return $api.post(`/contract/create`, { contract: newContract })
    },
}