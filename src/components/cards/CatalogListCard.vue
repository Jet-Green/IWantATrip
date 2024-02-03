<script setup>
import { useRouter } from "vue-router";

let props = defineProps({
    trip: Object,
});

let router = useRouter();

function goToCatalogPage() {
    router.push(`/catalog-trip?_id=${props.trip._id}`);
}

</script>
<template>
    <div @click="goToCatalogPage" style="height: 100%;" class="trip-card" :id='trip._id'>
        <div class="title d-flex direction-column space-between">
            <p class="ma-0">{{ trip.name }}</p>
            <p class="ma-0 pr-4" style="font-size:8px; text-align:right; text-transform: uppercase; ">{{ trip.tripType }}
            </p>
        </div>

        <a-card hoverable>
            <div>
                <img :src="trip.images[0]" style="object-fit: cover; width: 100%; height: 175px" />
            </div>

        </a-card>

    </div>
</template>
<style lang="scss" scoped>
.title {
    height: 100%;
    font-size: clamp(0.875rem, 0.7647rem + 0.1961vw, 1rem);
    // text-transform: uppercase;
    color: black;
    text-align: center;
    font-weight: 500;
    background: rgb(245, 245, 245);

}

.trip-card {

    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>
