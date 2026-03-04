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
  dateNumber = dateNumber - props.trip.timezoneOffset
  const date = new Date(dateNumber);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("ru-RU", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      timeZone: 'UTC' // Используем UTC для гарантии, что время будет в формате UTC
    });
  }
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
          <img :src="trip.images[0]" style="object-fit: cover; width: 100%; height: 175px" />
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
  height: clamp(12.5rem, 8.629rem + 8.0645vw, 15rem); // 200 - 240
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
