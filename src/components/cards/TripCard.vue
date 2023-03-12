<script setup>

import { useRouter } from "vue-router";


let props = defineProps({
  trip: Object,
});

let router = useRouter();
function goToTripPage() {
  router.push(`/trip?_id=${props.trip._id}`)
}
const clearData = (dataString) => {
  let date
  if (dataString.length == 13) {
    const dataFromString = new Date(Number(dataString));
    date = dataFromString

  } else {
    date = new Date(dataString)
  };
  return date.toLocaleDateString("ru-Ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",

  })
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
        <span>
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
