import { defineStore } from 'pinia'
import UserService from '../service/UserService'
import LocationService from '../service/LocationService';
import axios from 'axios'

import { render } from 'vue-email';
import BuyTripTemplate from '../email-templates/BuyTripTemplate.vue';

export const useAuth = defineStore('auth', {
    state: () => ({
        isAuth: false,
        userStatus: 'user',
        user: {
            tripCalc: []
        }
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
        updateUser(userToUpdate) {
            try {
                return UserService.updateUser(userToUpdate)
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
                const emailHtml = await render(BuyTripTemplate, bill);

                let { data } = await UserService.buyTrip(tripId, bill, emailHtml)
                this.user.boughtTrips.push(data)
                return data
            } catch (error) {
                console.log(error);
            }
        },
        async cancelTrip(_id, user_id) {
            try {
                return UserService.cancelTrip(_id, user_id)
            } catch (error) {
                console.log(error);
            }
        },
        async registration(data) {
            try {
                const response = await UserService.registration(data);
                localStorage.setItem('token', response.data.accessToken);

                this.isAuth = true
                this.user = response.data.user
                return response
            } catch (err) {
                return err
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
        /*  location:
            _id
            name
            shortName 
            coordinates
        */
        async selectUserLocation(location) {
            this.user.userLocation = location
            return await LocationService.selectUserLocation(location, this.user._id)
        },
        async addTripCalc(tripCalc) {
            delete tripCalc._id
            delete tripCalc.__v
            let res = await UserService.addTripCalc(this.user._id, tripCalc)
            this.user.tripCalc = res.data.tripCalc
            return
        },
        async deleteTripType(_id) {
            let res = await UserService.deleteTripType(this.user._id, _id)

            if (res.status == 200) {
                for (let i = 0; i < this.user.tripCalc.length; i++) {
                    if (this.user.tripCalc[i]._id == _id) {
                        this.user.tripCalc.splice(i, 1)
                    }
                }
            }
            return
        },
        async getBoughtTrips() {
            try {
                let res = await UserService.getBoughtTrips(this.user?._id)
                this.user.boughtTrips = res.data
            } catch (error) {
                console.log(error);
            }
        }
    },
})