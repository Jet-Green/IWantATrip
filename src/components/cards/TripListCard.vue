<script setup>
import { useRouter } from "vue-router";
import { useTrips } from "../../stores/trips"

let props = defineProps({
  trip: Object,
});
const tripStore = useTrips()
let router = useRouter();
// 'Привет ' + name + ' ' + 'Приятно познакомиться' то же самое, что и:
//  `Привет ${name} Приятно Познакомиться`

async function tripToDelete() {
  await tripStore.deleteById({ _id: props.trip._id })
}

function goToTripPage() {
  router.push(`/trip?_id=${props.trip._id}`);
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

</script>
<template>
  <!-- <span class="mdi mdi-12px mdi-close" style="color: #245159; cursor: pointer; float: right"
    @click="tripToDelete(trip._id)"></span> -->
  <div @click="goToTripPage">
    <div class="title mt-4">{{ trip.name }}</div>
    <a-badge-ribbon :text="`${trip.cost.length ? trip.cost[0].price : 0} руб`" color="ff6600">
      <a-card hoverable>
        <div>
          <img :src="trip.images[0]" style="object-fit: cover; width: 100%; height: 175px" />
        </div>
        <p style="text-align: center;">
          c <strong>{{ clearData(trip.start) }}</strong> по
          <strong>{{ clearData(trip.end) }}</strong>
        </p>
      </a-card>
    </a-badge-ribbon>
  </div>
</template>
<style lang="scss" scoped>
.title {
  font-size: 16px;
  text-transform: uppercase;
  color: black;
}
</style>
