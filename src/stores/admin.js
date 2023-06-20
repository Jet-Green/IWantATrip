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
        }
    }
});