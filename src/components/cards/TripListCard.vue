<script setup>
import { useRouter } from "vue-router";
import TripService from "../../service/TripService";

let props = defineProps({
  trip: Object,
});
let router = useRouter();
// 'Привет ' + name + ' ' + 'Приятно познакомиться' то же самое, что и:
//  `Привет ${name} Приятно Познакомиться`
async function tripToDelete() {
  await TripService.deleteTrip({ _id: props.trip._id });
}

function goToTripPage() {
  router.push(`/trip?_id=${props.trip._id}`);
}
const clearData = (dataString) => {
  const dataFromString = new Date(dataString);
  return dataFromString.toLocaleDateString();
};
</script>
<template>
  <!-- <span
    class="mdi mdi-12px mdi-close"
    style="color: #245159; cursor: pointer; float: right"
    @click="tripToDelete(trip._id)"
  ></span> -->
  <div @click="goToTripPage" style="max-width: 300px">
    <div class="title">{{ trip.name }}</div>
    <a-badge-ribbon
      :text="`${trip.cost.length ? trip.cost[0].price : 0} руб`"
      color="ff6600"
    >
      <a-card hoverable>
        <div>
          <img
            :src="trip.images[0]"
            style="object-fit: cover; width: 100%; height: 175px"
          />
        </div>
        <p style="text-align: center">
          c <strong>{{ clearData(trip.start) }}</strong> по
          <strong>{{ clearData(trip.end) }}</strong>
        </p>
      </a-card>
    </a-badge-ribbon>
  </div>
</template>
<style lang="scss" scoped>
.custom-card {
  margin: 8px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  .cover {
    object-fit: contain;
    display: flex;
    justify-content: center;
    background-color: #c4c4c4;
  }
}

.title {
  font-size: 16px;
  text-transform: uppercase;
  text-align: center;
}
</style>
