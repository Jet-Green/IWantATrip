import { defineStore } from 'pinia'
import UserService from '../service/UserService'
import TripService from '../service/TripService';
import LocationService from '../service/LocationService';
import axios from 'axios'

import { render } from 'vue-email';
import BuyTripTemplate from '../email-templates/BuyTripTemplate.vue';
import BuyTripUserTemplate from '../email-templates/BuyTripUserTemplate.vue';

export const useAuth = defineStore('auth', {
    state: () => ({
        isAuth: false,
        userStatus: 'user',
        user: {
            tripCalc: []
        },
        isRefreshing: false
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
            let trip = await TripService.getById(tripId)
            trip=trip.data
            let infToAdmins = {name:trip.name,
                start:trip.start,
                end:trip.end}
            let infToUser = {name:trip.name,
                    start:trip.start,
                    end:trip.end,
                    returnConditions:trip.returnConditions,
                    description:trip.description,
                    fullname:trip.author.fullname
                }
            try {
                const emailHtmlForAdmins = await render(BuyTripTemplate, { form: bill, trip: infToAdmins });
                const emailHtmlForUser = await render(BuyTripUserTemplate, { form: bill, trip: infToUser});

                let response = await UserService.buyTrip(tripId, bill, emailHtmlForAdmins, emailHtmlForUser)
                this.user.boughtTrips.push(response.data)
                return response
            } catch (error) {
                console.log(error);
            }
        },
        async payTinkoffBill(bill, tinkoffData, tripName, author) {
            try {
                const emailHtml = await render(BuyTripTemplate, { form: bill, tripName });

                let response = await UserService.payTinkoffBill({ billId: bill._id, tinkoffData, emailHtml, author })
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        },
        async cancelTrip(bill_id, user_id) {
            try {
                return UserService.cancelTrip(bill_id, user_id)
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
                if (this.isRefreshing) return
                this.isRefreshing = true
                //использовать service для вызова
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/refresh`, { withCredentials: true })
                localStorage.setItem('token', response.data.accessToken);

                this.isAuth = true;
                this.user = response.data.user
                this.isRefreshing = false
            } catch (err) {
                console.log(err);
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
        },
        async determineWinner() {
            try {
                let res = await UserService.determineWinner()
                return res.data
            } catch (error) {
                console.log(error);
            }
        }
    },
})