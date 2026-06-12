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
    return `От ${min.price}₽`
  } else {
    return 'Бесплатно'
  }


}) 
</script>
<template>
  <div class="excursion-card" :style="{ 'background-image': 'url(' + excursion.images[0] + ')' }">
    <div class="content">
      <div class="title"> {{ excursion.name }} </div>

      <div class="information">
        <span class="about-excursion">
          {{ excursion.excursionType.type }} |
          {{ excursion.duration }}
        </span>
        <span class="price">
          {{ getPrice }}
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.excursion-card {
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 10px;
  object-fit: contain;

  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
}

.content {
  height: 100%;
  width: 100%;
  background: linear-gradient(to bottom, transparent, #484848);
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 16px 16px 16px;
}

.title {
  // font-size: clamp(1rem, 0.55rem + 0.8vw, 1.25rem);
  font-size: 26px;
  font-weight: 900;
  color: white;
  width: 100%;
  line-height: 1.1;
}

.information {
  color: white;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.about-excursions {
  font-weight: 400;
  font-size: 12px;
  line-height: 1.1;
}

.price {
  font-weight: 600;
  font-size: clamp(1.25rem, 0.9517rem + 0.8523vw, 1.625rem); // 20 -> 26
  line-height: 1.1;
}
</style>