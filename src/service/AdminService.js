import $api from "../plugins/axios";

export default {
    fetchUsers(filters) {
        return $api.post('/admin/get-users', filters)
    }
}