<script setup>
import { ref, onMounted, computed } from "vue";
import CatalogCabinetTrip from "../cards/CatalogCabinetTrip.vue";
import { useAuth } from "../../stores/auth.js";
import { useTrips } from "../../stores/trips.js";

let userStore = useAuth();
let tripStore = useTrips();

let activeKey = ref('1')

let allModeratedTrips = ref([])
let allNotModeratedTrips = ref([])
let loading = ref(true)
let query = ref('')

let notModeratedTrips = computed(() => {
    if (query.value.length > 2) {
        localStorage.setItem("cabinetQuery", query.value);
        return allNotModeratedTrips.value.filter((trip) => trip.name.toLowerCase().includes(query.value.toLowerCase())
            || trip.description.toLowerCase().includes(query.value.toLowerCase())
            || trip.tripRoute.toLowerCase().includes(query.value.toLowerCase())
            || trip.tripType.toLowerCase().includes(query.value.toLowerCase())
            || trip?.startLocation?.name.toLowerCase().includes(query.value.toLowerCase())
            || (trip.partner ? trip.partner.toLowerCase().includes(query.value.toLowerCase()) : false)
            || trip.offer.toLowerCase().includes(query.value.toLowerCase())
            || trip.userComment?.toLowerCase().includes(query.value.toLowerCase())
        )
    } else {
        localStorage.setItem("cabinetQuery", '');
        return allNotModeratedTrips.value
    }
})

let moderatedTrips = computed(() => {

    if (query.value.length > 2) {
        localStorage.setItem("cabinetQuery", query.value);
        return allModeratedTrips.value.filter((trip) => trip.name.toLowerCase().includes(query.value.toLowerCase())
            || trip.description.toLowerCase().includes(query.value.toLowerCase())
            || trip.tripRoute.toLowerCase().includes(query.value.toLowerCase())
            || trip.tripType.toLowerCase().includes(query.value.toLowerCase())
            || trip?.startLocation?.name.toLowerCase().includes(query.value.toLowerCase())
            || (trip.partner ? trip.partner.toLowerCase().includes(query.value.toLowerCase()) : false)
            || trip.offer.toLowerCase().includes(query.value.toLowerCase())
            || trip.userComment?.toLowerCase().includes(query.value.toLowerCase())
        )
    } else {
        localStorage.setItem("cabinetQuery", '');
        return allModeratedTrips.value
    }

})

async function deleteTrip() {
    loading.value = true
    await getAllModeratedTrips()
    await getAllNotModeratedTrips()
    loading.value = false
}

async function getAllModeratedTrips() {
    loading.value = true
    let response = await tripStore.getMyCatalogTrips(userStore.user?._id)

    allModeratedTrips.value = response.data
    loading.value = false
}
async function getAllNotModeratedTrips() {
    loading.value = true
    let response = await tripStore.getMyCatalogTripsOnModeration(userStore.user?._id)

    allNotModeratedTrips.value = response.data
    loading.value = false
}

onMounted(async () => {
    query.value = localStorage.getItem("cabinetQuery") ?? '';
    await getAllModeratedTrips()
    await getAllNotModeratedTrips()
});

</script>
<template>
    <div>
        <a-input v-model:value="query" placeholder="поиск" />
    </div>
    <a-row style="width: 100%">
        <a-col :span="24">
            <a-collapse v-model:activeKey="activeKey" ghost>
                <a-collapse-panel key="1" header="Активные">
                    <a-col :span="24" v-if="loading" class="d-flex justify-center">
                        <img src="../../assets/images/founddog.webp" alt="" style="height: 150px;">
                    </a-col>
                    <a-col :span="24" v-else>
                        <a-row :gutter="[8, 8]" class="mt-8" v-if="moderatedTrips.length > 0">
                            <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of moderatedTrips" :key="trip._id">
                                <CatalogCabinetTrip @deleteTrip="deleteTrip" :trip="trip" />
                            </a-col>
                        </a-row>
                        <a-row :lg="8" :sm="12" :xs="24" v-else>
                            Нет туров
                        </a-row>
                    </a-col>
                </a-collapse-panel>
                <a-collapse-panel key="2" header="На модерации">
                    <a-col :span="24" v-if="loading" class="d-flex justify-center">
                        <img src="../../assets/images/founddog.webp" alt="" style="height: 150px;">
                    </a-col>
                    <a-col :span="24" v-else>
                        <a-row :gutter="[8, 8]" class="mt-8" v-if="notModeratedTrips.length > 0">
                            <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of notModeratedTrips" :key="index">
                                <CatalogCabinetTrip @deleteTrip="deleteTrip" :trip="trip" />
                            </a-col>
                        </a-row>
                        <a-row :lg="8" :sm="12" :xs="24" v-else>
                            Нет туров
                        </a-row>
                    </a-col>
                </a-collapse-panel>
            </a-collapse>
        </a-col>
    </a-row>
</template>
<style lang="scss" scoped></style>