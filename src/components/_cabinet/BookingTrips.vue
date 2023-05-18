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
      <h3>Вы заказали</h3>
      <a-row :gutter="[8, 8]" class="mt-8">
        <a-col :lg="8" :sm="12" :xs="24" v-for="booking in bookings" v-if="bookings.length">
          
          <a-card class="card " hoverable>
           
            <div>
              Тур: {{ booking.type.toString().toLowerCase() }}
            </div>
            <div>
             C {{ clearData(booking.start) }} по {{ clearData(booking.end) }}
            </div>
           
            <div>
              На {{ booking.duration }} дн.
            </div>
            <div v-if="booking.adults ">
              Взрослых: {{ booking.adults }} чел.
            </div>
            <div v-if="booking.children ">
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

    </a-col>
  </a-row>
</template>
<style scoped lang="scss">

</style>