import { defineStore } from "pinia";
import BusService from "../service/BusService";

export const useBus = defineStore('bus', () => {
    async function get() {
        let res = await BusService.get()
        return res.data
    }

    async function createBus(bus) {
        let res = await BusService.createBus(bus)
        return res
    }

    return { get, createBus }
})