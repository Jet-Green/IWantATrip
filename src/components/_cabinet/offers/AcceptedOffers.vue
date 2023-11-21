<script setup>
import { onMounted, ref } from 'vue'

import { useBooking } from '../../../stores/booking';

import { useRoute } from 'vue-router';

import OfferCard from './OfferCard.vue';

const bookingStore = useBooking()
const route = useRoute()

let acceptedOffers = ref([])
let loading = ref(false)

async function updateOffersList() {
    let res = await bookingStore.getOffersByBookingId(route.query.booking_id, 'accepted')
    acceptedOffers.value = res.data
}

onMounted(async () => {
    loading.value = true
    await updateOffersList()
    loading.value = false
})
</script>
<template>
    <a-row v-if="acceptedOffers.length > 0 && !loading" class="mt-8" :gutter="[8, 8]">
        <a-col :span="24" v-for="offer in acceptedOffers" :key="offer._id">
            <OfferCard :offer="offer" :acceptButton="false" :rejectButton="true" :toNewButton="true"
                @updateOffersList="updateOffersList" />
        </a-col>
    </a-row>
    <a-row v-if="acceptedOffers.length == 0 && !loading">
        <a-col>
            пусто
        </a-col>
    </a-row>
    <a-row v-if="loading" style="height: 60vh; display: flex; align-items: center">
        <a-col :span="24" class="d-flex justify-center">
            <a-spin size="large" />
        </a-col>
    </a-row>
</template>