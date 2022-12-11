<script setup>
import { onMounted, ref } from 'vue'
import { useAuth } from "../../stores/auth";
import { useCompanions } from '../../stores/companions';

const userStore = useAuth()
const companionStore = useCompanions()

let trips = ref([])
const companionRequests = userStore.user.companionRequests

onMounted(async () => {
  for (let _id of companionRequests) {
    const { data } = await companionStore.getById(_id)
    trips.value.push(data)
  }
})
</script>
<template>
  <div>
    <p>{{ trips }}</p>
  </div>
</template>
