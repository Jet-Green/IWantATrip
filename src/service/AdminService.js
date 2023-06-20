import $api from "../plugins/axios";

export default {
    fetchUsers(filters) {
        return $api.post('/admin/get-users', filters)
    },
    changeUserRoles(email, roles) {
        return $api.post('/admin/change-user-roles', { email, roles })
    }
}