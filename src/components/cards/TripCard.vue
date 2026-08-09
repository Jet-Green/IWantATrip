<script setup>

import { useRouter } from "vue-router";
import { formatTripPeriod } from "../../service/tripDateService.js";


let props = defineProps({
  trip: Object,
});

let router = useRouter();
function goToTripPage() {
  router.push(props.trip.slug ? `/trip/${props.trip.slug}` : `/trip?_id=${props.trip._id}`)
}
function getDate() {
  return formatTripPeriod(props.trip)
}
</script>
<template>
  <div @click="goToTripPage">
    <a-badge-ribbon :text="`${trip.cost.length ? trip.cost[0].price : 0} руб`">
      <div class="card" :style="{ 'background-image': 'url(' + trip.images[0] + ')' }">
        <div class="content">

          <div class="title"> {{ trip.name }} </div>
          {{ getDate() }}
        </div>
      </div>
      <!-- <a-card hoverable style="text-align: center;">
        <div>
          <img :src="trip.images[0]" alt="not found" style="object-fit: cover; width: 100%; height: 175px" fetchpriority=high/>
        </div>
        <span>
          <strong>{{ getDate() }}</strong>
        </span>
      </a-card> -->
    </a-badge-ribbon>
  </div>
</template>
<style lang="scss" scoped>
.card {
  aspect-ratio: 270 / 175;
  background-position: center;
  background-size: cover;
  padding: 0;
  display: flex;
  align-items: end;
  border-radius: 10px;
  cursor: pointer;
  height: clamp(11.25rem, 8.267rem + 8.5227vw, 15rem); // 180 - 240
  background-color: #484848;
}

.content {
  width: 100%;
  background: linear-gradient(to bottom, transparent, #484848);
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: flex-end;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 0 16px 16px 16px;

  color: white;


  .title {
    font-size: clamp(1rem, 0.6023rem + 1.1364vw, 1.5rem); // 16 - 24
    font-weight: 900;
    text-overflow: ellipsis;
  }
}

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
</style>
