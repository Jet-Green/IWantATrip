<script setup>
import BackButton from "../BackButton.vue";
import ExcursionCard from "./ExcursionCard.vue";
import ExcursionFilter from '../sections/ExcursionFilter.vue'
import { onMounted, ref, toRefs, watch } from "vue"


import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useExcursion } from "../../stores/excursion";
import { useLocations } from "../../stores/locations";

const backRoute = { name: 'Landing', hash: '#guide' };
const router = useRouter()
const route = useRoute();
const excursionStore = useExcursion()

watch(() => useLocations().location._id, async () => {
  excursionStore.getAll()
})

onMounted(async () => {
if (excursionStore.excursion.length == 0) {
  await excursionStore.getAll()
}
});

</script>
<template>
  <div>
    <BackButton :backRoute="backRoute" />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h3>Экскурсии</h3>
        <ExcursionFilter :search="route.query.search"/>
        <a-row :gutter="[12, 16]">
          <a-col :span="24" :sm="12" :md="8" v-for="ex of excursionStore.excursion">
            <ExcursionCard :excursion="ex" @click="router.push(`/excursion?_id=${ex._id}`)" />
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
