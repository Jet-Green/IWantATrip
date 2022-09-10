import $api from "../plugins/axios";

export default class TripService {
    static async fetchElementsByQuery(name) {
        return $api.get(`/guide/get-all-elements?name=${name}`)
    }
}