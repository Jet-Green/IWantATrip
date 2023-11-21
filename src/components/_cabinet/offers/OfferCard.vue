<script setup>
import { useRoute } from 'vue-router';

import { useAuth } from '../../../stores/auth';
import { useBooking } from '../../../stores/booking';

const route = useRoute()

const authStore = useAuth()
const bookingStore = useBooking()

const props = defineProps(['offer', 'acceptButton', 'rejectButton', 'toNewButton'])
const emit = defineEmits(['updateOffersList'])

let { offer, acceptButton, rejectButton, toNewButton } = props

async function acceptOffer(offerId) {
    let res = await bookingStore.acceptOffer(route.query.booking_id, offerId, { ...authStore.user.fullinfo, email: authStore.user.email })
    if (res.status == 200) {
        emit('updateOffersList')
    }
}
async function rejectOffer(offerId) {
    let res = await bookingStore.rejectOffer(route.query.booking_id, offerId)
    if (res.status == 200) {
        emit('updateOffersList')
    }
}
async function toNewOffer(offerId) {
    let res = await bookingStore.toNewOffer(route.query.booking_id, offerId)
    if (res.status == 200) {
        emit('updateOffersList')
    }
}
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
</script>
<template>
    <a-card style="padding: 12px">
        <span v-html="offer.offerText">
        </span>
        <div>
            Название организации: <b>{{ offer.offerer.name }}</b>
        </div>
        <div class="mt-16">
            <a-popconfirm v-if="acceptButton" title="Вы уверены?" ok-text="Да" cancel-text="Нет"
                @confirm="acceptOffer(offer._id)" class="mr-8">
                <a-button class="mr-8 rounded" type="primary">принять</a-button>
            </a-popconfirm>
            <a-popconfirm v-if="rejectButton" title="Вы уверены?" ok-text="Да" cancel-text="Нет"
                @confirm="rejectOffer(offer._id)" class="mr-8">
                <a-button class="rounded">отказать</a-button>
            </a-popconfirm>
            <a-popconfirm v-if="toNewButton" title='Отправить в "новые"?' ok-text="Да" cancel-text="Нет"
                @confirm="toNewOffer(offer._id)">
                <a-button class="rounded">отмена</a-button>
            </a-popconfirm>
        </div>
        <div style="text-align: end; position: absolute; bottom: 0; right: 0; margin: 0 10px 10px 0">
            {{ clearData(offer.date) }}
        </div>
    </a-card>
</template>
<style scoped>
.rounded {
    border-radius: 16px;
}
</style>