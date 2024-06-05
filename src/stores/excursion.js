import { defineStore } from 'pinia'
import ExcursionService from '../service/ExcursionService.js'
import _ from 'lodash'
import { useAuth } from './auth.js'
import { useLocations } from './locations.js'



export const useExcursion = defineStore('excursion', {
    state: () => ({
        excursions: [],
        cursor: 1,
        catalogCursor: 1,
        searchCursor: 1,
        isFetching: false,
        excursionFilter: {
            query: "",
            start: "",
            end: "",
            type: ""
        }
    }),
    getters: {
    },
    actions: {
        async create(excursion) {
            return await ExcursionService.create({ excursion, userId: useAuth().user._id })
        },
        async edit(excursion) {
            return await ExcursionService.edit(excursion)
        } ,
        async getUserExcursions() {
            const user = useAuth().user
            return await ExcursionService.getUserExcursions(user._id)
        },

        /** 
         * dates are from datePlugin.excursions.concatDateAndTime
         * _id is excursion _id
        */
        async createDates(dates, _id) {
            const userStore = useAuth()
            return await ExcursionService.createDates(dates, _id, userStore.user._id)
        },
        async getAll() {
            try {
                this.excursions = []
                let response;
                response = await ExcursionService.getAll(useLocations().location._id,this.excursionFilter.query,this.excursionFilter.start, Date.now(), this.excursionFilter.type)
               
                this.excursions.push(...response.data);
                this.excursions = _.uniqBy(this.excursions, '_id')
                // this.cursor++
                
            } catch (err) {
                console.log(err);
            }
            // return await ExcursionService.getAll(useLocations().location._id,this.excursionFilter.query)
        },
        async getExcursionById(_id) {
            return await ExcursionService.getExcursionById(_id)
        },
        /**
         * _id is excursion _id
         */
        async getExcursionBillsById(_id) {
            return await ExcursionService.getExcursionBillsById(_id)
        },
        async deleteExcursionBill(_id) {
            return await ExcursionService.deleteExcursionBill(_id)
        },
        async deleteExcursionBooking(_id) {
            return await ExcursionService.deleteExcursionBooking(_id)
        },
        async getExcursionBookingsById(_id) {
            return await ExcursionService.getExcursionBookingsById(_id)
        },
        async getTimeCustomers(excursionId, timeId) {
            return await ExcursionService.getTimeCustomers(excursionId, timeId)
        },
        async getTimeBookings(excursionId, timeId) {
            return await ExcursionService.getTimeBookings(excursionId, timeId)
        },
        async deleteTime(dateId, timeId) {
            return await ExcursionService.deleteTime(dateId, timeId)
        },
        async deleteDate(dateId) {
            const userStore = useAuth()
            return await ExcursionService.deleteDate(dateId, userStore.user._id)
        },
        async addTime(excursionId, date, time) {
            return (await ExcursionService.addTime(excursionId, date, time)).data
        },
        async timeHasBills(timeId) {
            return (await ExcursionService.timeHasBills(timeId)).data
        },


        async uploadImages(data) {
            return await ExcursionService.uploadImages(data)
        },
        async deleteById(_id) {
            return await ExcursionService.deleteById(_id)
        },
        async hideExcursion(_id, isHide) {
            return await ExcursionService.hideExcursion(_id, isHide)
        },
        async buy(timeId, toSend) {
            let userStore = useAuth()
            return await ExcursionService.buy(timeId, userStore.user._id, toSend)
        },
        async book(count, timeId, excursionId) {
            let userStore = useAuth()
            return await ExcursionService.book({ time: timeId, excursion: excursionId, user: userStore.user._id, count })
        },
        async order(fullinfo,excursionId) {
            let userStore = useAuth()
            return await ExcursionService.order({ fullinfo: fullinfo, excursionId:excursionId, user: userStore.user._id })
        },
        async getExcursionsOnModeration() {
            return await ExcursionService.getExcursionsOnModeration()
        },
        async deleteExcursion(_id) {
            return await ExcursionService.deleteExcursion(_id)
        },
        async approvExcursion(_id) {
            return await ExcursionService.approvExcursion(_id)
        },
        async buyFromCabinet(timeId, toSend, fullinfo) {
            return await ExcursionService.buyFromCabinet(timeId, toSend, fullinfo)
        },
        async bookFromCabinet(bookingCount, timeId, excursionId, fullinfo) {
            return await ExcursionService.bookFromCabinet({ count: bookingCount, time: timeId, excursion: excursionId, userInfo: fullinfo })
        },
    }
})