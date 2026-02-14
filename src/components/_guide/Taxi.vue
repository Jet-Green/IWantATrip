<script setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useGuide } from '../../stores/guide';
import BackButton from "../BackButton.vue";
import { useLocations } from "../../stores/locations";

let localTaxi = ref({})

let guideStore = useGuide()
let locationStore = useLocations()

const { location } = storeToRefs(locationStore)

let refreshTaxi = async () => {
    let location = {}
    if (localStorage.getItem("location")) {
        location = JSON.parse(localStorage.getItem("location"))
    }
    let res = await guideStore.getLocalTaxi(location)

    localTaxi.value = res.data
}
watch(location, () => {
    refreshTaxi()
})

onMounted(async () => {
    refreshTaxi()
    locationStore.refreshLocation()
})
</script>
<template>
    <div>
        <BackButton />

        <a-row type="flex" justify="center">
            <a-col :xs="22" :lg="16">
                <h2>Такси</h2>
                <a-row v-if="localTaxi.length != 0" :gutter="[8, 8]" type="flex" justify="center">
                    <a-col v-for="(t, i) in localTaxi" :xs="24" :md="12" :xl="8">
                        <a :href="`tel:${t.phone}`">
                            <a-card hoverable style="padding:10px 10px; border-radius: 10px; position: relative;"
                                :class='i % 2 == 0 ? "orange" : "blue"'>
                                <div style="font-size:24px"><b>{{ t.name }}</b></div>
                                <div style="font-size:18px"><MdiIcon name="phone-in-talk" class="number" /> {{ t.phone }}
                                </div>
                                <MdiIcon style="position: absolute; bottom: 5px; right: 5px;" name="taxi" class="taxi" />
                            </a-card>
                        </a>
                    </a-col>
                </a-row>
                <a-row v-else>
                    В вашем городе нет такси.
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>
<style>
.taxi {
    font-size: clamp(1rem, 2rem, 3rem);
}

.orange {
    background-color: #FF6600;
    color: white;
}

.blue {
    background-color: #64BED8;
    color: white;
}


.number {
    font-size: 16px;
    color: white;
    font-size: large;
}
</style>