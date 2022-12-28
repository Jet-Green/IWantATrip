import $api from "../plugins/axios";

export default {
    getAppState() {
        return $api.get('/app-state/app-state')
    }
}