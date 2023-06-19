import { defineStore } from 'pinia'
import AdminService from '../service/AdminService';

export const useAdmin = defineStore('admin', {
    state: () => ({
        users: [],
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
                this.users = res.data
                return res
            } catch (error) {
                console.log(error);
            }
        }
    }
});