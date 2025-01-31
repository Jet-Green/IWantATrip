<script setup>
import { ref, onMounted, watch, computed, } from "vue";
import CabinetTrip from "../cards/CabinetTrip.vue";
import { useAuth } from "../../stores/auth.js";
import { useTrips } from "../../stores/trips.js";

let userStore = useAuth();
let tripStore = useTrips();

let allTrips = ref([])
let loading = ref(true)
let page=ref(1)
let query = ref('')

let getArchivedTrips = computed(() => {
    let ArchivedTrips = [];
    for (let trip of allTrips.value) {
        if (trip.start < Date.now()) {
            ArchivedTrips.push(trip)
        }
    }
    return ArchivedTrips
})

// let filteredTrips = computed(() => {
//     if (query.value.length > 2) {
//         localStorage.setItem("cabinetQuery", query.value);
//         // getAllTrips()
//         return allTrips.value
//     } else {
//         localStorage.setItem("cabinetQuery", '');
//         return allTrips.value
//     }
// })

async function getAllTrips() {
    loading.value = true
    let userId = userStore.user._id
    let filter = {
      $or: [
        { "name": { $regex: query.value, $options: 'i' } },
        { "description": { $regex: query.value, $options: 'i' } },
        { "tripRoute": { $regex: query.value, $options: 'i' } },
        { "tripType": { $regex: query.value, $options: 'i' } },
        { 'startLocation.name': { $regex: query.value, $options: 'i' } },
        { "partner": { $regex: query.value, $options: 'i' } },
        { "offer": { $regex: query.value, $options: 'i' } },
        { "userComment": { $regex: query.value, $options: 'i' } },
      ],
    };
    let response = await tripStore.getCreatedTripsInfoByUserId(userId,filter,page.value)

    allTrips.value = response.data
    loading.value = false
}

async function deleteTrip() {
    await getAllTrips()
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

watch(query,()=>{
    if (query.value.length > 2) {
        localStorage.setItem("cabinetQuery", query.value);
        getAllTrips()
    } else {
        localStorage.setItem("cabinetQuery", '');
        getAllTrips()
    }
})

onMounted(async () => {
    query.value = localStorage.getItem("cabinetQuery") ?? '';
    await getAllTrips()
});

</script>
<template>
    <div>
        <a-input v-model:value="query" placeholder="поиск"/>
    </div>
    <a-col :span="24" v-if="loading" class="d-flex justify-center">
        <img src="../../assets/images/founddog.webp" alt="" style="height: 150px;">
    </a-col>
    <a-col :span="24" v-else><a-row :gutter="[8, 8]" class="mt-8" v-if="getArchivedTrips.length > 0">
            <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of getArchivedTrips" :key="trip._id">

                <CabinetTrip :trip="trip"
                    :actions="['delete', 'info', 'copy', 'edit', 'addDate', 'transports', 'addLocation', 'editComment']"
                    @deleteTrip="deleteTrip" @updateTrip="getAllTrips" />
            </a-col>
        </a-row>
        <a-row :lg="8" :sm="12" :xs="24" v-else>
            Нет туров
        </a-row></a-col>
</template>
<style></style>