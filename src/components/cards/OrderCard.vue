<script setup>

let { booking } = defineProps({
    booking: Object,
});

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

</script>
<template>
    <a-card class="card" hoverable >
        <div>
            Дата заказа : <b> {{ clearData(booking.dateOfBooking) }}</b>
        </div>
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
            Направление: {{ booking.location?.toString().toLowerCase() }}
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
        <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
        <slot></slot> 
    </a-card>
</template>
<style lang="scss" scoped></style>
