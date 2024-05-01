<script setup>
import BackButton from "../BackButton.vue";
import ExcursionCard from "./ExcursionCard.vue";

import { onMounted, ref } from "vue"

import { useRouter } from 'vue-router';
import { useExcursion } from "../../stores/excursion";

const router = useRouter()
const excursionStore = useExcursion()

let excursionDates = ref([])

onMounted(async () => {
  let response = await excursionStore.getAll()
  excursionDates.value = response.data
})
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h3>Экскурсии</h3>
        <a-row>
          <a-col :span="24" :sm="12" :md="6" v-for="eDate of excursionDates">
            <ExcursionCard :edate="eDate" @click="router.push(`/excursion?_id=${eDate._id}`)" />
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
