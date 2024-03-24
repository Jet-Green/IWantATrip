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

let query = ref("");
let type = ref("");

let tripTypes=ref("")

// let router = useRouter();

function find (){
    tripStore.catalogCursor = 1
    
    query.value = query.value.trim()
    localStorage.setItem("CatalogTripQuery", query.value)
    localStorage.setItem("CatalogTripType", type.value)

    tripStore.cursor = 1
    tripStore.catalog = []

    tripStore.catalogFilter.query = query.value
    tripStore.catalogFilter.type = type.value

    tripStore.fetchCatalogTrips();
}


function resetForm() {
    tripStore.catalogFilter.query = ""
    tripStore.catalogFilter.type = ""
    query.value = '';
    type.value = '';

    tripStore.catalogFilter.query = query.value
    tripStore.catalogFilter.type = type.value

    localStorage.setItem("CatalogTripQuery", "")
    localStorage.setItem("CatalogTripType", "")

    find()
}

onMounted(async() => {
    query.value = localStorage.getItem("CatalogTripQuery") ?? '';
    type.value = localStorage.getItem("CatalogTripType") ?? '';
    tripTypes=appStore.appState[0].tripType

    if (props.search) {
        query.value = props.search;
    }
    query.value || type.value ? find() : null
});

</script>
<template>
    <a-row type="flex" justify="center" class="section_bg">
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
                            v-for="tripType in tripTypes" :value="tripType">{{
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
