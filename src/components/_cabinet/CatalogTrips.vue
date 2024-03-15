<script setup>
import { ref, onMounted, computed } from "vue";
import CatalogCabinetTrip from "../cards/CatalogCabinetTrip.vue";
import { useAuth } from "../../stores/auth.js";
import { useTrips } from "../../stores/trips.js";

let userStore = useAuth();
let tripStore = useTrips();

let allTrips = ref([])
let loading = ref(true)
let query = ref('')

let trips = computed(() => {

    if (query.value.length > 2) {
        localStorage.setItem("cabinetQuery", query.value);
        return allTrips.value.filter((trip) => trip.name.toLowerCase().includes(query.value.toLowerCase())
            || trip.description.toLowerCase().includes(query.value.toLowerCase())
            || trip.tripRoute.toLowerCase().includes(query.value.toLowerCase())
            || trip.tripType.toLowerCase().includes(query.value.toLowerCase())
            || trip.startLocation.name.toLowerCase().includes(query.value.toLowerCase())
            || (trip.partner ? trip.partner.toLowerCase().includes(query.value.toLowerCase()) : false)
            || trip.offer.toLowerCase().includes(query.value.toLowerCase())
            || trip.userComment?.toLowerCase().includes(query.value.toLowerCase())
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
    let response = await tripStore.getMyCatalogTrips({ catalogTrips: userStore.user?.catalogTrips })

    allTrips.value = response.data
    loading.value = false
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
        <a-spin size="large" />
    </a-col>
    <a-col :span="24" v-else>
        <a-row :gutter="[8, 8]" class="mt-8" v-if="trips.length > 0">
            <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of trips" :key="index">
                <CatalogCabinetTrip :trip="trip" />
                <!-- <CabinetTrip :trip="trip"
                    :actions="['delete', 'info', 'copy', 'hide', 'edit', 'addDate', 'addLocation', 'transports', 'editComment']"
                    @deleteTrip="deleteTrip" @updateTrip="getAllTrips" /> -->
            </a-col>
        </a-row>
        <a-row :lg="8" :sm="12" :xs="24" v-else>
            Нет туров
        </a-row></a-col>
</template>
<style></style>