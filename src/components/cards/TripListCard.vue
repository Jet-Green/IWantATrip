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
  dateNumber = dateNumber - props.trip.timezoneOffset
  const date = new Date(dateNumber);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("ru-RU", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      timeZone: 'UTC'
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
  <div class="card-wrapper" @click="goToTripPage">
    <a-badge-ribbon :text="`${trip.cost.length ? trip.cost[0].price : 0} руб`" placement="end">
      <div class="card" :style="{ 'background-image': 'url(' + trip.images[0] + ')' }">
        <div class="content">
          <div class="trip-type">{{ trip.tripType }}</div>
          <div class="title"> {{ trip.name }} </div>
          <div class="date-row">
            <span class="date-text">{{ getDate() }}</span>
            <span class="trip-type-small">{{ trip.tripType }}</span>
          </div>
        </div>
      </div>
    </a-badge-ribbon>
  </div>
</template>
<style lang="scss" scoped>
.card-wrapper {
  width: 100%;
  display: block;
}

.card {
  aspect-ratio: 270 / 175;

  background-position: center;
  background-size: cover;
  padding: 0;
  display: flex;
  align-items: end;
  border-radius: 10px;
  cursor: pointer;
  // height: clamp(11.25rem, 8.267rem + 8.5227vw, 15rem);
  width: 100%;
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

  .trip-type {
    font-size: clamp(0.625rem, 0.4559rem + 0.4818vw, 0.875rem);
    text-transform: uppercase;
    opacity: 0.8;
  }

  .date-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 8px;
  }

  .date-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  .trip-type-small {
    font-size: clamp(0.625rem, 0.4559rem + 0.4818vw, 0.875rem);
    text-transform: uppercase;
    opacity: 0.8;
    flex-shrink: 0;
  }

  .title {
    font-size: clamp(1rem, 0.6023rem + 1.1364vw, 1.5rem);
    font-weight: 900;
    text-overflow: ellipsis;
  }
}
</style>
