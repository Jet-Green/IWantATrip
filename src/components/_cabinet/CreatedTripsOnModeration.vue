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
    "isModerated": {$eq:false} ,
    };
    let archive=false
    let response = await tripStore.getCreatedTripsInfoByUserId(userId,filter,page.value,archive)

    allTrips.value = response.data
    loading.value = false
}

async function deleteTrip() {
    await getAllTrips()
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
        <a-input v-model:value="query" placeholder="поиск" />
    </div>
    <a-col :span="24" v-if="loading" class="d-flex justify-center">
        <img src="../../assets/images/founddog.webp" alt="" style="height: 150px;">
    </a-col>
    <a-col :span="24" v-else>
        <a-row :gutter="[8, 8]" class="mt-8" v-if="allTrips.length > 0">
            <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of allTrips" :key="trip._id">
                <CabinetTrip :trip="trip" :actions="['delete', 'info', 'edit', 'msg', 'transports', 'editComment']"
                    @deleteTrip="deleteTrip" @updateTrip="getAllTrips" />
            </a-col>
        </a-row>
        <a-row :lg="8" :sm="12" :xs="24" v-else>
            Нет туров
        </a-row></a-col>
</template>
<style></style>