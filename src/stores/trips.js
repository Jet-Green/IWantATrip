import { defineStore } from 'pinia'

import { useAuth } from './auth'
import _ from 'lodash'
import BookingService from '../service/BookingService'
import TripService from '../service/TripService.js'

import { render } from 'vue-email';
import CreateTripTemplate from '../email-templates/CreateTripTemplate.vue';

export const useTrips = defineStore('trips', {
    state: () => ({
        trips: [],
        catalog: [],
        cursor: 1,
        catalogCursor: 1,
        searchCursor: 1,
        isFetching: false,
        tripFilter: {
            query: "",
            start: "",
            end: "",
            type: ""
        },
        catalogFilter: {
            query: "",
            type: ""
        }
    }),
    getters: {
        getTrips(state) {
            return state.trips
        },
    },
    actions: {
        async createManyByDates(dates, parentId) {
            return TripService.createManyByDates(dates, parentId)
        },
        async createTrip(form, user) {
            const email = user.email
            const fullinfo = user.fullinfo
            const emailHtml = await render(CreateTripTemplate, { form: form, email, fullinfo });

            return TripService.createTrip(emailHtml, form, email, fullinfo)
        },
        async createCatalogTrip(form, user) {
            const email = user.email
            const fullinfo = user.fullinfo
            const emailHtml = await render(CreateTripTemplate, { form: form, email, fullinfo });

            return TripService.createCatalogTrip(emailHtml, form, email, fullinfo)
        },
        async fetchTrips(query, start, end, type) {
            try {
                if (!this.isFetching) {
                    this.isFetching = true
                    let response;
                    let location = localStorage.getItem('location')
                    if (location) {
                        location = JSON.parse(location)
                    }
                    if (location?.name) {
                        response = await TripService.fetchTrips(this.cursor, ...location.coordinates, query, start, end, type);
                        this.isFetching = false
                    } else {
                        response = await TripService.fetchTrips(this.cursor, '', '', query, start, end, type);
                        this.isFetching = false
                    }
                    this.trips.push(...response.data);
                    this.trips = _.uniqBy(this.trips, '_id')
                    this.cursor++
                }
            } catch (err) {
                console.log(err);
            }
        },
        async fetchCatalogTrips(query, type) {
            try {
                if (!this.isFetching) {
                    this.isFetching = true
                    let response;
                    let location = localStorage.getItem('location')
                    if (location) {
                        location = JSON.parse(location)
                    }
                    if (location?.name) {
                        response = await TripService.fetchCatalogTrips(this.catalogCursor, ...location.coordinates, query, type);
                        this.isFetching = false
                    } else {
                        response = await TripService.fetchCatalogTrips(this.catalogCursor, '', '', query, type);
                        this.isFetching = false
                    }
                    this.catalog.push(...response.data);
                    this.catalog = _.uniqBy(this.catalog, '_id')
                    this.catalogCursor++
                }

            } catch (err) {
                console.log(err);
            }
        },
        async getMyCatalogTrips() {
            return await TripService.getMyCatalogTrips()
        },
        getById(_id) {
            return TripService.getById(_id)
        },
        deleteById(_id) {
            return TripService.deleteTrip({ _id: _id });
        },
        getCustomers(ids) {
            return TripService.getCustomers(ids)
        },
        findForModeration() {
            return TripService.findForModeration()
        },
        findRejectedTrips() {
            return TripService.findRejectedTrips()
        },
        findCatalogTrips() {
            return TripService.findCatalogTrips()
        },
        async moderateTrip(_id) {
            try {
                return await TripService.moderateTrip(_id)
            } catch (error) {
                console.log(error);
            }
        },
        async sendModerationMessage(trip_id, msg) {
            try {
                return await TripService.sendModerationMessage(trip_id, msg)
            } catch (error) {
                console.log(error);
            }
        },
        // когда открываем Созданные туры
        // Получает все туры, созданные пользователем
        async getCreatedTripsInfoByUserId(_id) {
            try {
                return await TripService.getCreatedTripsInfoByUserId(_id)
            } catch (error) {
                console.log(error);
            }
        },
        // когда переходим на страницу с покупателями туры
        async getFullTripById(_id) {
            try {
                return await TripService.getFullTripById(_id)
            } catch (error) {
                console.log(error);
            }
        },
        async setPayment(bill) {
            try {
                return await TripService.setPayment(bill)
            } catch (error) {
                console.log(error);
            }
        },
        async deletePayment(bill_id) {
            try {
                return await TripService.deletePayment(bill_id)
            } catch (error) {
                console.log(error);
            }
        },
        async getBookingTrips(status) {
            try {
                let res = await BookingService.getBookingTrips(status)
                return res.data
            } catch (error) {
                console.log(error);
            }
        },
        async changeBookStatus(_id, status) {
            try {
                let res = await BookingService.changeBookStatus(_id, status)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async updateBooking(booking) {
            try {
                let res = await BookingService.updateBooking(booking)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async updateTourists(bill) {
            try {
                let res = await TripService.updateTourists(bill)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async updatePartner(partner, trip_id) {
            try {
                let res = await TripService.updatePartner(partner, trip_id)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async updateIsCatalog(_id, isCatalog) {
            try {
                let res = await TripService.updateIsCatalog(_id, isCatalog)
                return res
            } catch (error) {
                console.log(error);
            }
        },
        async updateIncludedLocations(updateObject) {
            try {
                return await TripService.updateIncludedLocations(updateObject)
            } catch (error) {
                console.log(error);
            }
        },
        async updateTransports(updateObj) {
            try {
                return await TripService.updateTransports(updateObj)
            } catch (error) {
                console.log(error);
            }
        },
        async findTripByCustomerName(name, userId) {
            try {
                return await TripService.findTripByCustomerName(name, userId)
            } catch (error) {
                console.log(error);
            }
        },
        async setUserComment(tripId, comment) {
            try {
                return await TripService.setUserComment({ tripId, comment })
            } catch (error) {
                console.log(error);
            }
        },
        async editUserComment(bodyObj) {
            try {
                return await TripService.editUserComment(bodyObj)
            } catch (error) {

            }
        },
        async getBoughtTrips() {
            try {
                let userStore = useAuth()
                let res = await TripService.getBoughtTrips(userStore.user._id)
                return res.data
            } catch (error) {
                console.log(error);
            }
        },
        async getCatalogTripById(catalogTripId) {
            try {
                return await TripService.getCatalogTripById(catalogTripId)
            } catch (error) {
                console.log(error);
            }
        }
    },
})