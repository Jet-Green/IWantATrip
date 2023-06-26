<script setup>

import { useRouter } from "vue-router";


let props = defineProps({
  trip: Object,
});

let router = useRouter();
function goToTripPage() {
  router.push(`/trip?_id=${props.trip._id}`)
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
  <div @click="goToTripPage" style="width: 270px">
    <span class="title"> {{ trip.name }} {{ props.color }} </span>
    <a-badge-ribbon :text="`${trip.cost.length ? trip.cost[0].price : 0} руб`">
      <a-card hoverable>
        <div>
          <img :src="trip.images[0]" style="object-fit: cover; width: 100%; height: 175px" />
        </div>
        <span style="text-align: center;" v-if="clearData(trip.start) == clearData(trip.end)">
          <strong>{{ clearData(trip.start) }}</strong>
        </span>
        <span v-else>
          c <strong>{{ clearData(trip.start) }}</strong> по <strong>{{ clearData(trip.end) }}</strong>
        </span>
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
  color: white;
}
</style>
