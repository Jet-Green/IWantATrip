import { defineStore } from 'pinia'
import AdminService from '../service/AdminService';

export const useAdmin = defineStore('admin', {
    state: () => ({
    }),
    getters: {
    },
    actions: {
        /**
         * query: String
         * role: String
         */
        async fetchUsers(filters = { query: '', role: 'user' }) {
            try {
                let res = await AdminService.fetchUsers(filters)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async changeUserRoles(email, roles) {
            try {
                return await AdminService.changeUserRoles(email, roles)
            } catch (error) {
                console.log(error);
            }
        },
        addEmail(event, email) {
            try {
                return AdminService.addEmail(event, email)
            } catch (error) {
                console.log(error);
            }
        },
        getEmails(event) {
            try {
                return AdminService.getEmails(event)
            } catch (error) {
                console.log(error);
            }
        },
        deleteEmail(event, email) {
            try {
                return AdminService.deleteEmail(event, email)
            } catch (error) {
                console.log(error);
            }
        },
        addCabinetNotifications(event, email) {
            try {
                return AdminService.addCabinetNotifications(event, email)
            } catch (error) {
                console.log(error);
            }
        },
        getNotifications(event) {
            try {
                return AdminService.getNotifications(event)
            } catch (error) {
                console.log(error);
            }
        },
        deleteNotfications(event, email) {
            try {
                return AdminService.deleteNotfications(event, email)
            } catch (error) {
                console.log(error);
            }
        }
    }
});