<script setup>
import { ref, onMounted, watch, computed } from "vue";

import { useAuth } from "../../stores/auth.js";
import { useTrips } from "../../stores/trips.js";

let userStore = useAuth();
let tripStore = useTrips();


let loading = ref(true)
let buyer = ref('')
let tripsByCustomers = ref([]);


let findUsersTrip = async () => {

    let userId = userStore.user._id
    let response = await tripStore.findTripByCustomerName(buyer.value, userId)
    tripsByCustomers.value = response.data
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


</script>
<template>
    <div class="d-flex ma-4">
        <a-input v-model:value="buyer" placeholder="покупатель" style="width: 250px;" />
        <a-button @click="findUsersTrip()" class="ma-4 lets_go_btn">Найти</a-button>
    </div>

    <div>

        <a-row :gutter="[8, 8]">
            <a-col :lg="8" :sm="12" :xs="24" v-for="trip in tripsByCustomers">
                <a-card class="card" hoverable>
                    <div style="text-align:center">
                        {{ trip.name }}
                    </div>
                    <div>
                        <span class="mdi mdi-calendar-arrow-right"></span>
                        {{ `c ${clearData(trip.start)}` }}
                        <span class="mdi mdi-calendar-arrow-left"></span>
                        {{ `по ${clearData(trip.end)}` }}
                    </div>
                </a-card>
            </a-col>
        </a-row>



    </div>
</template>
<style></style>