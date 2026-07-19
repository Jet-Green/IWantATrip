<script setup>
import { computed } from 'vue'
import _ from "lodash"
import datePlugin from "../../plugins/dates"

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

function isDatePast(dateObj) {
  const now = new Date()
  const d = new Date(dateObj.year, dateObj.month, dateObj.day)
  return d < new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const briefDates = computed(() => {
  if (!excursion.dates?.length) return []
  return excursion.dates
    .filter(d => !isDatePast(d.date))
    .map(d => {
      const pretty = datePlugin.excursions.getPrettyDate(d.date)
      return `${pretty.day} ${pretty.month}`
    })
})
</script>
<template>
  <div class="excursion-card" :style="{ 'background-image': 'url(' + excursion.images[0] + ')' }">
    <div class="content">
      <div class="title"> {{ excursion.name }} </div>

      <div v-if="briefDates.length" class="dates">
        <span v-for="(d, i) in briefDates" :key="i">
          {{ d }}<span v-if="i < briefDates.length - 1">, </span>
        </span>
      </div>

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

.dates {
  color: white;
  font-size: 13px;
  font-weight: 600;
  width: 100%;
  margin-top: 4px;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>