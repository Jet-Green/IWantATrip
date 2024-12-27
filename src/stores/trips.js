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
            type: "",
            tripRegion: "",
            locationRadius: 100
        },
        catalogFilter: {
            query: "",
            type: ""
        },
        printContractTour: {}
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
        async fetchTrips() {
            try {
                if (!this.isFetching) {
                    this.isFetching = true
                    let response;
                    let location = localStorage.getItem('location')
                    if (location) {
                        location = JSON.parse(location)
                    }
                    if (location?.name) {
                        response = await TripService.fetchTrips(
                            this.cursor,
                            ...location.coordinates,
                            this.tripFilter.query,
                            this.tripFilter.start,
                            this.tripFilter.end,
                            this.tripFilter.type,
                            this.tripFilter.tripRegion,
                            this.tripFilter.locationRadius,
                            location.name
                        );
                        this.isFetching = false
                    } else {
                        response = await TripService.fetchTrips(
                            this.cursor,
                            '', '',
                            this.tripFilter.query,
                            this.tripFilter.start,
                            this.tripFilter.end,
                            this.tripFilter.type,
                            this.tripFilter.tripRegion,
                            this.tripFilter.locationRadius,
                            null
                        );
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
        async fetchCatalogTrips() {
            try {
                if (!this.isFetching) {
                    this.isFetching = true
                    let response;
                    let location = localStorage.getItem('location')
                    if (location) {
                        location = JSON.parse(location)
                    }
                    if (location?.name) {
                        response = await TripService.fetchCatalogTrips(this.catalogCursor, ...location.coordinates, this.catalogFilter.query, this.catalogFilter.type);
                        this.isFetching = false
                    } else {
                        response = await TripService.fetchCatalogTrips(this.catalogCursor, '', '', this.catalogFilter.query, this.catalogFilter.type);
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
        async getMyCatalogTrips(id) {
            return await TripService.getMyCatalogTrips(id)
        },
        async getMyCatalogTripsOnModeration(id) {
            return await TripService.getMyCatalogTripsOnModeration(id)
        },
        getById(_id) {
            return TripService.getById(_id)
        },
        deleteById(_id) {
            return TripService.deleteTrip({ _id: _id });
        },
        catalogToDelete(_id) {
            return TripService.catalogToDelete({ _id: _id });
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
        findRejectedCatalog() {
            return TripService.findRejectedCatalog()
        },
        findCatalogForModeration() {
            return TripService.findCatalogForModeration()
        },
        async moderateCatalogTrip(_id) {
            try {
                return await TripService.moderateCatalogTrip(_id)
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
        async sendCatalogModerationMessage(trip_id, msg) {
            try {
                return await TripService.sendCatalogModerationMessage(trip_id, msg)
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
        async getFullCatalogById(_id) {
            try {
                return await TripService.getFullCatalogById(_id)
            } catch (error) {
                console.log(error);
            }
        },
        async moderateTrip(_id) {
            try {
                return await TripService.moderateTrip(_id)
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
        async deleteOrder(_id) {
            try {
                return await BookingService.deleteOrder(_id)
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
        async updateCatalogTrip(_id, trip) {
            try {
                let res = await TripService.updateCatalogTrip(_id, trip)
                return res.data
            } catch (error) {
                console.error(error)
            }
        },

        async editCatalogTrip(_id, trip) {
            try {
                return await TripService.editCatalogTrip(_id, trip)

            } catch (error) {
                console.error(error)
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
        async updatePartner(partner, trip_id, canSellPartnerTour) {
            try {
                let res = await TripService.updatePartner(partner, trip_id, canSellPartnerTour)
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
        async getBoughtSeats(_id) {
            try {
                return (await TripService.getBoughtSeats(_id)).data
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
        },
        async moveToCatalog(tripId) {
            try {
                return await TripService.moveToCatalog(tripId)
            } catch (error) {
                console.log(error);
            }
        },
        async addAdditionalService(tripId, service) {
            try {
                return await TripService.addAdditionalService(tripId, service)
            } catch (error) {
                console.log(error);
            }
        },
        async deleteAdditionalService(tripId, serviceId) {
            try {
                return await TripService.deleteAdditionalService(tripId, serviceId)
            } catch (error) {
                console.log(error);
            }
        },
    },
})