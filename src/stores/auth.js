import { defineStore } from 'pinia'
import UserService from '../service/UserService'
import LocationService from '../service/LocationService';
import { message } from 'ant-design-vue';
import axios from 'axios'

export const useAuth = defineStore('auth', {
    state: () => ({
        isAuth: false,
        userStatus: 'user',
        user: null
    }),
    getters: {
        getUserStatus(state) {
            return state.userStatus
        },
        getAuthStatus(state) {
            return state.isAuth
        },
    },
    actions: {
        async resetPassword(password, token, user_id) {
            let response = await UserService.resetPassword(password, token, user_id)

            localStorage.setItem('token', response.data.accessToken);

            this.isAuth = true
            this.user = response.data.user
        },
        async forgotPassword(email) {
            try {
                let response = await UserService.forgotPassword(email);
                return response
            } catch (error) {
                console.log(error);
            }
        },
        updateUser(user) {
            try {
                return UserService.updateUser(user)
            } catch (err) {
                return {
                    success: false,
                    message: err.response?.data?.message
                }
            }
        },
        setUserStatus(text) {
            this.userStatus = text
        },
        async buyTrip(tripId, bill) {
            try {
                let { data } = await UserService.buyTrip(tripId, bill)
                this.user.boughtTrips.push(data)
                return
            } catch (error) {
                console.log(error);
            }
        },
        async registration(email, password) {
            try {
                const response = await UserService.registration(email, password, user);
                localStorage.setItem('token', response.data.accessToken);

                this.isAuth = true
                this.user = response.data.user
                return { success: true };
            } catch (err) {
                return {
                    success: false,
                    message: err.response?.data?.message
                }
            }
        },
        async login(email, password) {
            try {
                const response = await UserService.login(email, password);
                localStorage.setItem('token', response.data.accessToken);

                this.isAuth = true;
                this.user = response.data.user
                return { success: true };
            } catch (err) {
                return {
                    success: false,
                    message: err.response?.data?.message
                }
            }
        },
        async checkAuth() {
            try {
                //использовать service для вызова
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/refresh`, { withCredentials: true })
                localStorage.setItem('token', response.data.accessToken);

                this.isAuth = true;
                this.user = response.data.user
            } catch (err) {
                console.log(err);
                // message.config({ duration: 3, top: '90vh' })
                // message.error({ content: err.response?.data?.message })
            }
        },
        async logout() {
            try {
                const response = await UserService.logout();
                localStorage.removeItem('token');

                this.isAuth = false;
                this.user = null
            } catch (err) {
                console.log(err);
            }
        },
        async searchLocation(searchReq) {
            return await LocationService.searchLocation(searchReq)
        },
        async selectUserLocation(location) {
            return await LocationService.selectUserLocation(location, this.user._id)
        }
    },
})