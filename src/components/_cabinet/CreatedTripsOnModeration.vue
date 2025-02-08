<script setup>
import { ref, onMounted, watch, computed, } from "vue";
import CabinetTrip from "../cards/CabinetTrip.vue";
import { useAuth } from "../../stores/auth.js";
import { useTrips } from "../../stores/trips.js";

let userStore = useAuth();
let tripStore = useTrips();

let page = 1
let allTrips = ref([])
let loading = ref(true)
let query = ref('')
let userId = userStore.user._id
let showMoreButton = ref(true)
async function getAllTrips() {
    loading.value = true

    let filter = {
      $or: [
        { "name": { $regex: query.value, $options: 'i' } },
        { "description": { $regex: query.value, $options: 'i' } },
        { "parent": { $exists: true } }
    ],
    "isModerated": {$eq:false} ,
    };
 
    let response = await tripStore.getCreatedTripsInfoByUserId(userId,filter,page)
    // response.length < 10 ? showMoreButton.value = false : showMoreButton.value = true
    allTrips.value.push(...response)
    loading.value = false
}

async function deleteTrip() {
    await getAllTrips()
}

async function getNextTrips() {
    page++
    await getAllTrips()
}
watch(query, (newQuery, oldQuery) => {
    if (query.value.length > 2 || newQuery.length <= oldQuery.length) {
        localStorage.setItem("cabinetQuery", query.value);
        allTrips.value = []
        page = 1
        getAllTrips()
    }
})

onMounted(async () => {
    query.value = localStorage.getItem("cabinetQuery") ?? '';
    tripStore.cabinetTripsCursor=0
    await getAllTrips()
});

</script>
<template>
    <div>
        <a-input v-model:value="query" placeholder="поиск" allow-clear />
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
            <a-col :span="24" v-if="showMoreButton">
                <div class="justify-center d-flex ma-16" @click="getAllTrips()"> <a-button>Ещё</a-button></div>
            </a-col>
      
        </a-row>
        <a-row :lg="8" :sm="12" :xs="24" v-else>
            Нет туров
        </a-row></a-col>
</template>
<style></style>