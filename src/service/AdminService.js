import $api from "../plugins/axios";

export default {
    fetchUsers(filters) {
        return $api.post('/admin/get-users', filters)
    },
    changeUserRoles(email, roles) {
        return $api.post('/admin/change-user-roles', { email, roles })
    },
    addEmail(event, email) {
        return $api.post('/admin/add-email', { event, email })
    },
    getEmails(event) {
        return $api.get(`/admin/get-emails?event=${event}`,)
    },
    deleteEmail(event, email) {
        return $api.get(`/admin/delete-email?event=${event}&email=${email}`)
    },
    addCabinetNotifications(event, email) {
        return $api.post('/admin/add-cabinet-notifications', { event, email })
    },
    getNotifications(event) {
        return $api.post('/admin/get-notifications', { event })
    },
    deleteNotfications(event, email) {
        return $api.post('/admin/delete-notifications', { event, email })
    }
}