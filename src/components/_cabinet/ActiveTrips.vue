<script setup>
import { ref, onMounted, computed } from "vue";
import CabinetTrip from "../cards/CabinetTrip.vue";
import { useAuth } from "../../stores/auth.js";
import { useTrips } from "../../stores/trips.js";

let userStore = useAuth();
let tripStore = useTrips();

let allTrips = ref([])
let loading = ref(true)
let query = ref('')

let getTripsInWork = computed(() => {
    let tripsInWork = [];
    for (let trip of filteredTrips.value) {
        if (trip.start < Date.now()) {
            continue
        }
        if (trip.isModerated) {
            tripsInWork.push(trip);
        }
    }
    return tripsInWork
})

let filteredTrips = computed(() => {

    if (query.value.length > 2) {
        localStorage.setItem("cabinetQuery", query.value);
        return allTrips.value.filter((trip) => trip.name.toLowerCase().includes(query.value.toLowerCase())
            || trip.description.toLowerCase().includes(query.value.toLowerCase())
            || trip.tripRoute.toLowerCase().includes(query.value.toLowerCase())
            || trip.tripType.toLowerCase().includes(query.value.toLowerCase())
            || trip?.startLocation?.name.toLowerCase().includes(query.value.toLowerCase())
            || (trip.partner ? trip.partner.toLowerCase().includes(query.value.toLowerCase()) : false)
            || trip.offer.toLowerCase().includes(query.value.toLowerCase())
            || trip.userComment?.toLowerCase().includes(query.value.toLowerCase())
            || clearData(trip.start).includes(query.value.toLowerCase()) 
        )
    } else {
        localStorage.setItem("cabinetQuery", '');
        return allTrips.value
    }

})

async function deleteTrip() {
    await getAllTrips()
}


async function getAllTrips() {
    loading.value = true
    let userId = userStore.user._id
    let response = await tripStore.getCreatedTripsInfoByUserId(userId)

    allTrips.value = response.data
    loading.value = false
}
const clearData = (dataString) => {
    let date = 0
    if (dataString.length == 13) {
        const dataFromString = new Date(Number(dataString));
        date = dataFromString

    } else {
        date = new Date(dataString)
    };
    return date.toLocaleDateString("ru-Ru", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",

    })
}
onMounted(async () => {
    query.value = localStorage.getItem("cabinetQuery") ?? '';
    await getAllTrips()
});

</script>
<template>
    <div>
        <a-input v-model:value="query" placeholder="поиск" />
    </div>
    <a-col :span="24" v-if="loading" class="d-flex justify-center">
        <img src="../../assets/images/founddog.webp" alt="" style="height: 150px;">
    </a-col>
    <a-col :span="24" v-else>
        <a-row :gutter="[8, 8]" class="mt-8" v-if="getTripsInWork.length > 0">
            <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of getTripsInWork" :key="index">
                <CabinetTrip :trip="trip"
                    :actions="['delete', 'info', 'copy', 'hide', 'edit', 'addDate', 'addLocation', 'transports', 'editComment', 'addAdditionalService']"
                    @deleteTrip="deleteTrip" @updateTrip="getAllTrips" />
            </a-col>
        </a-row>
        <a-row :lg="8" :sm="12" :xs="24" v-else>
            Нет туров
        </a-row></a-col>
</template>
<style></style>