<script setup>
import { ref, onMounted } from "vue";
import BookingService from "../../service/BookingService";
import { useRouter } from 'vue-router'

const router = useRouter()

let bookings = ref([]);
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

function changeStatus(_id, status) {
    tripStore.changeBookStatus(_id, status)
}

function goToOfferTripPage(bookingId) {
    router.push({ name: 'OfferTrip', query: { booking_id: bookingId } })
}

function getOrderNumber(str) {
    return str.substring(str.length - 5)
}
function getOrderStatus(str) {
    switch (str) {
        case "open":
            return "открыт"
        case "inWork":
            return "в работе"
        case "closed":
            return "закрыт"
        default:
            break;
    }
    return str.substring(str.length - 5)
}


onMounted(() => {
    BookingService.getBookingTrips('open').then((data) => bookings.value = data.data)
});
</script>
<template>
    <a-row>
        <a-col :span="24">
            <h3>Заказы</h3>
            <a-row :gutter="[8, 8]" class="mt-8">
                <a-col :lg="8" :sm="12" :xs="24" v-for="booking in bookings" v-if="bookings.length">

                    <a-card class="card " hoverable>
                        <div>
                            <b>Дата заказа: {{ clearData(booking.dateOfBooking) }}</b>
                        </div>
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
                            Заказ № {{ getOrderNumber(booking._id) }} <b>{{ getOrderStatus(booking.status) }}</b>
                        </div>
                        <div class="d-flex justify-end">
                            <a-button @click="goToOfferTripPage(booking._id)">предложить</a-button>
                        </div>
                    </a-card>

                </a-col>
                <a-col v-else>
                    <span>нет заказанных туров</span>
                </a-col>
            </a-row>

        </a-col>
    </a-row>
</template>
<style scoped lang="scss"></style>