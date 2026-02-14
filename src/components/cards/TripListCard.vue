<script setup>
import { useRouter } from "vue-router";

let props = defineProps({
  trip: Object,
});

let router = useRouter();

function goToTripPage() {
  router.push(`/trip?_id=${props.trip._id}`);
}
const clearData = (dateNumber) => {
 
dateNumber  = dateNumber - props.trip?.timezoneOffset
  const date = new Date(dateNumber);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("ru-RU", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      timeZone: 'UTC' // Используем UTC для гарантии, что время будет в формате UTC
    });
  }
   console.log(date)
  return '';
}
function getDate() {
  let start = clearData(props.trip.start)
  let end = clearData(props.trip.end)

  if (props.trip.start < Date.now()) {
    for (let child of props.trip.children) {
      if (child.start >= Date.now()) {
        start = clearData(child.start)
        end = clearData(child.end)
      }
    }
  }

  if (start == end)
    return start
  else {
    return 'с ' + start + ' по ' + end
  }
}
</script>
<template>
  <div @click="goToTripPage" style="height: 100%;" class="trip-card" :id = 'trip._id'>
    <div class="title d-flex direction-column space-between">
      <p class="ma-0">{{ trip.name }}</p>
      <p class="ma-0 pr-4" style="font-size:8px; text-align:right; text-transform: uppercase; ">{{ trip.tripType }}</p>
    </div>

    <a-badge-ribbon :text="`${trip.cost.length ? trip.cost[0].price : 0} руб`" color="ff6600">
      <a-card hoverable>
        <div>
          <img :src="trip.images[0]" alt="not found" style="object-fit: cover; width: 100%; height: 175px" />
        </div>

        <div style="text-align: center;">
          <strong>{{ getDate() }} <span v-if="trip.children.length">и ...</span> </strong>
        </div>
      </a-card>
    </a-badge-ribbon>


  </div>
</template>
<style lang="scss" scoped>
.title {
  height: 100%;
  font-size: clamp(0.875rem, 0.7647rem + 0.1961vw, 1rem);
  // text-transform: uppercase;
  color: black;
  text-align: center;
  font-weight: 500;
  background: rgb(245, 245, 245);

}

.trip-card {

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
