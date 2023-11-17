<script setup>
import { onMounted, ref } from 'vue'
import BackButton from '../BackButton.vue';

import { useBooking } from '../../stores/booking';

import { useRoute } from 'vue-router';

const bookingStore = useBooking()
const route = useRoute()

let offers = ref([])

const clearData = (dateNumber) => {
    let date = new Date(dateNumber).toLocaleDateString("ru-Ru", {
        hour: '2-digit',
        minute: '2-digit',
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    })
    if (date !== 'Invalid Date' && date) {
        return date
    }
    return ''
}

onMounted(async () => {
    offers.value = await bookingStore.getOffersByBookingId(route.query.booking_id)
})
</script>
<template>
    <div>
        <BackButton />
        <a-row type="flex" justify="center">
            <a-col :xs="22" :lg="16">
                <h3>Предложения</h3>
                <a-row class="mt-8" :gutter="[8, 8]">
                    <a-col :span="24" v-for="offer in offers">
                        <a-card style="padding: 12px">
                            <span v-html="offer.offerText">
                            </span>
                            <div style="text-align: end;">
                                {{ clearData(offer.date) }}
                            </div>
                        </a-card>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>