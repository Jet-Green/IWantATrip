<script setup>
import { ref, computed, onMounted, getCurrentInstance } from "vue";

import { useRoute } from "vue-router";
import BackButton from "../components/BackButton.vue";
import { useTrips } from "../stores/trips";
import { useLocations } from "../stores/locations";
const API_URL = import.meta.env.VITE_API_URL

const app = getCurrentInstance();
const htmlToPaper = app.appContext.config.globalProperties.$htmlToPaper;

const route = useRoute();

const _id = route.query._id;

const tripStore = useTrips();

const locationStore = useLocations();

const backRoute = { name: 'CatalogPage', hash: `#${_id}` };

let trip = ref({});


let ShareLogo = ref([
    {
        network: "VK",

    },
    {
        network: "WhatsApp",

    },
    {
        network: "Telegram",

    },
    {
        network: "Email",

    },
    {
        network: "Viber",

    },


])

function getImg(index) {
    return trip.value.images[index];
}
function getLink() {

    return API_URL + route.fullPath
}

const print = async () => {
    await htmlToPaper('printMe');
};

let getStartLocationNames = computed(() => {

    let starts = trip.value.includedLocations.coordinates

    let results = []
    for (let i = 0; i < starts.length; i++) {
        for (let j = 0; j < locationStore.locations.length; j++) {

            if (starts[i][0] == locationStore.locations[j].coordinates[0]) {

                results.push(locationStore.locations[j].shortName)
            }
        }
    }
    return results.join(', ')
})

onMounted(async () => {
    let response = await tripStore.getFullTripById(_id);
    let tripFromDb = response.data;
    trip.value = tripFromDb;
});
</script>
<template>
    <div style="overflow-x: hidden">
        <BackButton :backRoute="backRoute" />
        <a-row class="justify-center d-flex">
            <a-col :xs="22" :xl="16">
                <h2 class="ma-0">{{ trip.name }}</h2>

                <p><i> {{ trip.offer }}</i> </p>

                <a-spin v-if="!trip._id" size="large"></a-spin>
                <a-row v-if="trip._id" :gutter="[12, 12]" class="text justify-center d-flex">

                    <a-col :xs="24" :md="12">
                        <a-carousel arrows dots-class="slick-dots slick-thumb">
                            <template #customPaging="props">
                                <a>
                                    <img :src="getImg(props.i)" />
                                </a>
                            </template>
                            <div v-for="(item, i) in trip.images" :key="i">
                                <img :src="item" alt="" srcset="" />
                            </div>
                            <template #prevArrow>
                                <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                                    <span class="mdi mdi-48px mdi-chevron-left"></span>
                                </div>
                            </template>
                            <template #nextArrow>
                                <div class="custom-slick-arrow" style="right: 10px">
                                    <span class="mdi mdi-48px mdi-chevron-right"></span>
                                </div>
                            </template>
                        </a-carousel>
                    </a-col>
                    <a-col :xs="24" :md="12" class="pa-8">

                        <div style="float: right;">
                            <span style="opacity: 0.7; cursor: pointer;" class="mdi mdi-24px mdi-printer ma-8 "
                                @click="print()"></span>

                            <a-dropdown :trigger="['click']">
                                <a class="ant-dropdown-link" @click.prevent>
                                    <span style="opacity: 0.7;"
                                        class="mdi mdi-24px mdi-share-variant-outline ma-8"></span>
                                </a>
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item v-for="link, index of  ShareLogo" :key="index">
                                            <ShareNetwork :network="link.network" :url='getLink()' :title="trip.name"
                                                :description="trip.offer">
                                                <span>{{ link.network }}</span>

                                            </ShareNetwork>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </div>


                        <div>
                            Старт: <b> {{ getStartLocationNames }}</b>
                        </div>

                        <div>
                            Продолжительность: <b>{{ trip.duration }}</b>
                        </div>
                        <div>
                            Ключевые точки: <b>{{ trip.tripRoute }}</b>
                        </div>
                        <a-button type="primary" class="lets_go_btn" style="display: flex; justify-content: center"
                                @click="orderCatalogDialog()">
                                Заказать
                        </a-button>
                    </a-col>

                    <a-col :xs="24">
                        <span v-html="trip.description"></span>
                    </a-col>
                    <a-divider class="ma-0"></a-divider>
                    <a-col :xs="24" v-if="trip.returnConditions" class="mb-16">
                        <b>Условия возврата:</b> {{ trip.returnConditions }}
                    </a-col>

                    <div id="printMe" style="display: none">
                        <h2 class="ma-0">{{ trip.name }}</h2>
                        <p><i> {{ trip.offer }}</i></p>
                        <div>
                            Продолжительность: <b>{{ trip.duration }}</b>
                        </div>
                        <div>
                            Ключевые точки: <b>{{ trip.tripRoute }}</b>
                        </div>
                        <span v-html="trip.description"></span>
                    </div>

                </a-row>
            </a-col>
        </a-row>
    </div>
</template>
<style lang="scss" scoped>
.pretty-tag {
    border-radius: 12px;
    font-size: 14px;
    padding: 4px 6px 4px 6px;
    user-select: none;
    cursor: pointer;
}

img {
    width: 100%;
    aspect-ratio: 270/175;
    object-fit: cover;
}

// .coster:nth-of-type(1n + 2) {
//   display: flex;
// }

.ant-carousel :deep(.slick-dots) {
    position: relative;
    height: auto;
}

.ant-carousel :deep(.slick-slide img) {
    border: 5px solid #fff;
    display: block;
    margin: auto;
    max-width: 100%;
}

.ant-carousel :deep(.slick-thumb) {
    bottom: 0px;
}

.ant-carousel :deep(.slick-thumb li) {
    width: 60px;
    height: 45px;
}

.ant-carousel :deep(.slick-thumb li img) {
    width: 100%;
    // height: 100%;
    filter: grayscale(100%);
    display: block;
}

.ant-carousel :deep(.slick-thumb li.slick-active img) {
    filter: grayscale(0%);
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
    color: white;
    line-height: normal;
    width: 50px;
    height: 50px;
    opacity: 1;
    z-index: 1;
    top: 40%;
}

.mdi-printer:hover {
    color: #ff6600;
}

.warning {
    color: red;
    font-style: italic;
}
</style>
