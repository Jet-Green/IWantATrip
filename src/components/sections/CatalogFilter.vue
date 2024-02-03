<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useTrips } from '../../stores/trips.js';
import { useAppState } from "../../stores/appState";

let props = defineProps({
    search: String,
});


const tripStore = useTrips();
const appStore = useAppState();

let time = ref([]);
let query = ref("");
let type = ref("");

let router = useRouter();


function find() {

    query.value = query.value.trim()
    localStorage.setItem("TripQuery", query.value)
    localStorage.setItem("TripType", type.value)

    tripStore.searchCursor = 1
    tripStore.cursor = 1
    tripStore.trips = []

    tripStore.tripFilter.query = query.value
    tripStore.tripFilter.type = type.value
    tripStore.fetchTrips(
        query.value,
        "",
        "",
        type.value,
    );
}


function resetForm() {
    tripStore.tripFilter.query = ""
    tripStore.tripFilter.type = ""
    time.value = null;
    query.value = '';

    localStorage.setItem("TripQuery", "")
    localStorage.setItem("TripType", "")

    find()
}

onMounted(() => {
    query.value = localStorage.getItem("TripQuery") ?? '';
    type.value = localStorage.getItem("TripType") ?? '';


    if (props.search) {
        query.value = props.search;
    }
    query.value || type.value ? find() : null

});

</script>
<template>
    <a-row type="flex" justify="center" class="section_bg ">
        <a-col :xs="22" :lg="12">

            <a-row :gutter="[8, 4]" class="d-flex justify-center align-center flex-wrap">
                <a-col :span="12" :md="6" class="d-flex direction-column">
                    <div for="search" style="font-size:10px; line-height:10px; ">искать</div>
                    <a-input v-model:value="query" placeholder="сочи" name="search" style="z-index: 0; width:100%" />

                </a-col>

                <a-col :span="12" :md="6" class="d-flex direction-column">
                    <div style="font-size:10px; line-height:10px">вид тура</div>
                    <a-select v-model:value="type">
                        <a-select-option value=""></a-select-option>
                        <a-select-option placeholder="Tип тура"
                            v-for="   tripType    in    appStore.appState[0].tripType   " :value="tripType">{{
                                tripType
                            }}</a-select-option>
                    </a-select>
                </a-col>

                <a-col :span="24" :md="12" class="d-flex align-center justify-end">
                    <div class="pa-8">
                        <a-tooltip title="Искать">
                            <a-button type="primary" shape="circle" @click="find" class="mr-4">
                                <span class=" mdi mdi-magnify">
                                </span>
                            </a-button>
                        </a-tooltip>
                        <a-tooltip title="Очистить">
                            <a-button shape="circle" @click="resetForm">
                                <span class=" mdi mdi-close">
                                </span>

                            </a-button>
                        </a-tooltip>
                    </div>

                </a-col>


            </a-row>
        </a-col>
    </a-row>
</template>

<style lang="scss" scoped>

.active_filter {
    color: #ff6600;
    cursor: pointer;
}

.filter {
    color: #227597;
    cursor: pointer;
}
</style>
