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
onMounted(async () => {
    open.value = await tripStore.getBookingTrips('open')
    // inWork.value = await tripStore.getBookingTrips('inWork')
    // closed.value = await tripStore.getBookingTrips('closed')
})
</script>
<template>
    <h1>Новые</h1>
    <a-row :gutter="[8, 8]" class="mt-8">
        <a-col :lg="8" :sm="12" :xs="24" v-for="booking in open" v-if="open.length">
          <a-card class="card " hoverable>
            <div>
              {{ booking.creatorId }}
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
   

    <h1>В работе</h1>
    {{ inWork }}

    <h1>Завершены</h1>
    {{ closed }}
</template>
<style lang="scss" scoped></style>