<script setup>
import { ref, onMounted } from "vue";
import BookingService from "../../service/BookingService";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useAuth } from "../../stores/auth.js";
import { useRouter } from 'vue-router'

let userStore = useAuth();

let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");
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
function goToOffersPage(_id) {
  router.push(`/offers?booking_id=${_id}`)
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
  BookingService.findByUserId(userStore.user._id).then((data) => bookings.value = data.data)

});
</script>
<template>
  <a-row>
    <a-col :span="24">
      <h3>Вы заказали</h3>
      <a-row :gutter="[16, 16]" class="mt-8">
        <a-col :lg="8" :sm="12" :xs="24" v-for="booking in bookings" v-if="bookings.length">
          <a-card hoverable style="padding: 12px; height: 100%; position: relative;" @click="booking.offers?.length > 0 ? goToOffersPage(booking._id): () => {}">
            <div v-if="booking.offers?.length > 0" class="custom-badge">
              {{ booking.offers.length }}
            </div>
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
          </a-card>
        </a-col>
        <a-col v-else>
          <span>У вас нет заказанных туров</span>
        </a-col>
      </a-row>

    </a-col>
  </a-row>
</template>
<style scoped lang="scss">
.custom-badge {
  position: absolute;
  top: -10px;
  right: -5px;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 22px;
  width: 22px;
  border-radius: 100px;

  background-color: #ff6600;
  color: white;
  font-weight: bold;
  user-select: none;
}
</style>