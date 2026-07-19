<script setup>
import BackButtonAdaptive from "../BackButtonAdaptive.vue";
import ExcursionCard from "./ExcursionCard.vue";
import ExcursionFilter from '../sections/ExcursionFilter.vue'
import { onMounted, ref, computed } from "vue"


import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useExcursion } from "../../stores/excursion";


const backRoute = { name: 'Landing', hash: '#guide' };
const router = useRouter()
const route = useRoute();
const excursionStore = useExcursion()
const isLoading = ref(false);

function isDatePast(dateObj) {
  const now = new Date()
  const d = new Date(dateObj.year, dateObj.month, dateObj.day)
  return d < new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const sortedExcursions = computed(() => {
  const list = [...excursionStore.excursions]
  return list.sort((a, b) => {
    const aFutureDates = (a.dates || []).filter(d => !isDatePast(d.date))
    const bFutureDates = (b.dates || []).filter(d => !isDatePast(d.date))
    const aHasDates = aFutureDates.length > 0
    const bHasDates = bFutureDates.length > 0
    if (aHasDates && !bHasDates) return -1
    if (!aHasDates && bHasDates) return 1
    if (aHasDates && bHasDates) {
      const aMinDate = aFutureDates.reduce((min, d) => {
        const val = d.date.year * 10000 + d.date.month * 100 + d.date.day
        return val < min ? val : min
      }, Infinity)
      const bMinDate = bFutureDates.reduce((min, d) => {
        const val = d.date.year * 10000 + d.date.month * 100 + d.date.day
        return val < min ? val : min
      }, Infinity)
      return aMinDate - bMinDate
    }
    return 0
  })
})

onMounted(async () => {

  if (route.hash) {
    let id = route.hash.slice(1)
    document.getElementById(id)?.scrollIntoView()
    window.scrollBy(0, -100);
  }

});

</script>
<template>
  <div>
    <a-row type="flex" justify="center">
      <a-col :xs="22" :md="20" :xl="18">
        <BackButtonAdaptive :backRoute="backRoute" />

        <h2 class="title">Экскурсии</h2>
        <ExcursionFilter :search="route.query.search" />

        <a-spin v-if="isLoading" size="large" style="display: flex; justify-content: center; margin: 40px 0;" />

        <a-row v-else :gutter="[12, 16]">
          <a-col :span="24" :sm="12" :md="8" :lg="6" v-for="ex of sortedExcursions" :key="ex._id">
            <ExcursionCard :excursion="ex" @click="router.push(`/excursion?_id=${ex._id}`)" :id="ex._id" />
          </a-col>

        </a-row>
        <a-row v-if="!sortedExcursions.length && !isLoading">
          <a-col :span="24">
            <h3 style="text-align: center;">Экскурсии не найдены!</h3>
          </a-col>

        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped>
.title {
  font-weight: 900;
}
</style>