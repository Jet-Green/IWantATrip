<script setup>
import { computed } from 'vue'
import _ from "lodash"
const props = defineProps({
  excursion: Object
})

const excursion = props.excursion

let getPrice = computed(() => {
  if (excursion.prices.length) {
    let min = _.minBy(excursion.prices, 'price')
    return `От ${min.price} руб` 
  } else {
    return 'Бесплатно'
  }


}) 
</script>
<template>
  <div class="card">
    <div class=" d-flex direction-column space-between">

      <p v-if="excursion.excursionType" class="ma-0 pr-4" style="font-size:10px; text-align:right; text-transform: uppercase; ">{{
        excursion.excursionType.type }} {{ excursion.excursionType.directionType }}</p>
      <p class="ma-0 pr-4" style="font-size:8px; text-align:right; text-transform: uppercase; ">{{ excursion.duration }}
      </p>
    </div>

    <img :src="excursion.images[0]" alt="картинка">
    <div class="title"> {{ excursion.name }}</div>
    <div class="price"> {{ getPrice }}</div>
  </div>
</template>
<style scoped lang="scss">
.card {
  overflow: hidden;
  cursor: pointer;
  height: 100%;

  img {
    object-fit: cover;
    width: 100%;
    aspect-ratio: 270 / 175;
  }
}

.title {

  font-size: clamp(1rem, 0.55rem + 0.8vw, 1.25rem);
  font-weight: 500;
}

.price {
  font-weight: 500;
  font-size: clamp(0.75rem, 0.3rem + 0.8vw, 1rem);
}
</style>