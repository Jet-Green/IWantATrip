<script setup>
import { ref, onMounted, computed } from "vue";
import BookingService from "../../service/BookingService";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useAuth } from "../../stores/auth.js";


let userStore = useAuth();
let router = useRouter();

let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");

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





onMounted(() => {
  BookingService.findByUserId(userStore.user._id).then((data) => bookings.value = data.data)

});
</script>
<template>
  <a-row>
    <a-col :span="24">
      <a-row :gutter="[8, 8]" class="mt-8">
        <a-col :lg="8" :sm="12" :xs="24" v-for="booking in bookings" v-if="bookings.length">
          <a-card class="card " hoverable>
            <div>
              <b>Тип: </b> {{ booking.type.toString() }}
            </div>
            <div>
              <b>Начало: </b> {{ clearData(booking.start) }}
            </div>
            <div>
              <b>Конец: </b> {{ clearData(booking.end) }}
            </div>
            <div>
              <b>Продолжительность: </b> {{ booking.duration }} дн.
            </div>
            <div>
              <b>Взрослых: </b> {{ booking.adults }} чел.
            </div>
            <div>
              <b>Детей: </b>{{ booking.children }} чел. от {{ booking.fromAge }} лет
            </div>
            <div>
              <b>Пожелания: </b>{{ booking.wishes }}
            </div>
            <div>
              <b>№ заказа: </b>{{ booking._id }}
            </div>

          </a-card>

        </a-col>
        <a-col v-else>
          <h2>У вас нет заказанных туров</h2>
        </a-col>
      </a-row>

    </a-col>
  </a-row>
</template>
<style scoped lang="scss">
.card {

  background: #f6f6f6;
  padding: 8px 8px 0 8px;
}
</style>