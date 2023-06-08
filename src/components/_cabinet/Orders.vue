<script setup>
import { onMounted, ref } from 'vue'
import { useTrips } from '../../stores/trips'

const tripStore = useTrips()

let open = ref([])
let inWork = ref([])
let closed = ref([])

onMounted(async () => {
    open.value = await tripStore.getBookingTrips('open')
    inWork.value = await tripStore.getBookingTrips('inWork')
    closed.value = await tripStore.getBookingTrips('closed')
})
</script>
<template>
    <h1>open</h1>
    {{ open }}

    <h1>inWork</h1>
    {{ inWork }}

    <h1>closed</h1>
    {{ closed }}
</template>
<style lang="scss" scoped></style>