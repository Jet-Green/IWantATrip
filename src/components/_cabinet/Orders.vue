<script setup>
import { onMounted, ref } from 'vue'
import { useTrips } from '../../stores/trips'

const tripStore = useTrips()

let open = ref([])
let inWork = ref([])
let closed = ref([])

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
onMounted(async () => {
    open.value = await tripStore.getBookingTrips('open')
    // inWork.value = await tripStore.getBookingTrips('inWork')
    // closed.value = await tripStore.getBookingTrips('closed')
})
</script>
<template>
    <h3>Новые</h3>
    <a-row :gutter="[8, 8]" class="mt-8">
        <a-col :lg="8" :sm="12" :xs="24" v-for="booking in open" v-if="open.length">
            <a-card class="card " hoverable>
                <div>
                   Имя:  <b> {{ booking.creatorId.fullinfo.fullname }}</b>
                </div>
                <div>
                     Телефон: <b> <a :href="getPhoneNumber(booking.creatorId.fullinfo.phone )"> {{ booking.creatorId.fullinfo.phone }}</a> </b>

                </div>
                <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
                <div>
                    Тур: {{ booking.type.toString().toLowerCase() }}
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
                    № заказа: {{ booking._id }}
                </div>

            </a-card>

        </a-col>
        <a-col v-else>
            <span>У вас нет заказанных туров</span>
        </a-col>
    </a-row>


    <h3>В работе</h3>
    {{ inWork }}

    <h3>Завершены</h3>
    {{ closed }}
</template>
<style lang="scss" scoped></style>