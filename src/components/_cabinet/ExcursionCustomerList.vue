<script setup>
import ExcursionCustomerCard from './ExcursionCustomerCard.vue'
defineProps({
    customers: Object
})
</script>

<template>
    <a-col :lg="8" :sm="12" :xs="24" v-for="customer in customers">
        <ExcursionCustomerCard :customer="customer"/>
    </a-col>
</template>
