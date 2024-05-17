import { defineStore } from "pinia";
import BusService from "../service/BusService";

export const useBus = defineStore('bus', () => {
    async function get() {
        let res = await BusService.get()
        return res.data
    }

    async function getById(_id) {
        let res = await BusService.getById(_id)
        return res.data
    }

    async function createBus(bus) {
        let res = await BusService.createBus(bus)
        return res
    }

    async function deleteBus(_id) {
        let res = await BusService.deleteBus(_id)
        return res.status
    }

    return { get, getById, createBus, deleteBus }
})