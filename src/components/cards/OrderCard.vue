<script setup>
import { useTrips } from '../../stores/trips'

let { booking } = defineProps({
    booking: Object,
});

let emit = defineEmits(['moveNext', 'movePrev'])

let tripStore = useTrips()

async function moveToNextStatus() {
    if (booking.status == 'open') {
        booking.status = 'inWork'
    } else if (booking.status == 'inWork') {
        booking.status = 'closed'
    }
    let res = await tripStore.changeBookStatus(booking._id, booking.status)
    if (res.status == 200) {
        emit('moveNext', booking)
    }
}

async function moveToPrevStatus() {
    if (booking.status == 'inWork') {
        booking.status = 'open'
    } else if (booking.status == 'closed') {
        booking.status = 'inWork'
    }

    let res = await tripStore.changeBookStatus(booking._id, booking.status)
    if (res.status == 200) {
        emit('movePrev', booking)
    }
}

async function editComment() {
    let res = await tripStore.updateBooking(booking)
}

const clearData = (dateNumber) => {
    let date = new Date(dateNumber).toLocaleDateString("ru-Ru", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    })
    if (date !== 'Invalid Date' && date) {
        return date
    }
    return ''
}
function getPhoneNumber(number) {
    return `tel:${number}`;
}
function getOrderNumber(str) {
    return str.substring(str.length - 5)
}
</script>
<template>
    <a-card class="card" hoverable>
        <div>
            Имя: <b> {{ booking.creatorId.fullinfo.fullname }}</b>
        </div>
        <div>
            Телефон: <b> <a :href="getPhoneNumber(booking.creatorId.fullinfo.phone)"> {{
                booking.creatorId.fullinfo.phone }}</a> </b>
        </div>
        <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
        <div>
            Тур: {{ booking.type.toString().toLowerCase() }}
        </div>
        <div>
            Направление: {{ booking.location.toString().toLowerCase() }}
        </div>
        <div>
            C {{ clearData(booking.start) }} по {{ clearData(booking.end) }}
        </div>

        <div>
            На {{ booking.duration }} дн.
        </div>
        <div v-if="booking.adults">
            Взрослых: {{ booking.adults }} чел.
        </div>
        <div v-if="booking.children">
            Детей: {{ booking.children }} чел. от {{ booking.fromAge }} лет
        </div>
        <div>
            Пожелания: {{ booking.wishes }}
        </div>
        <div>
            № заказа: {{ getOrderNumber(booking._id) }}
        </div>
        <div class="mt-8">
            <a-textarea placeholder="Заметка" v-model:value="booking.comment" :maxlength="300"
                :auto-size="{ minRows: 1 }"></a-textarea>
        </div>
        <div class="mt-8 d-flex justify-center" style="font-size: 24px; margin: 2px 8px 2px 8px;">
            <a-popconfirm v-if="booking.status != 'closed'" title="Вы уверены?" @confirm="moveToNextStatus" ok-text="Да"
                cancel-text="Нет">
                <span class="mdi mdi-arrow-down"></span>
            </a-popconfirm>
            <a-popconfirm v-if="booking.status != 'open'" title="Вы уверены?" @confirm="moveToPrevStatus" ok-text="Да"
                cancel-text="Нет">
                <span class="mdi mdi-arrow-up"></span>
            </a-popconfirm>
            <a-popconfirm v-if="booking.comment" title="Изменить сообщение?" @confirm="editComment" ok-text="Да"
                cancel-text="Нет">
                <span class="mdi mdi-comment-edit-outline"></span>
            </a-popconfirm>
        </div>
    </a-card>
</template>
<style lang="scss" scoped></style>
