<script setup>
import { onMounted, ref } from 'vue';
import { useContract } from '../../stores/contract'

const contractStore = useContract()

onMounted(async () => {
    await contractStore.getAll()
})
</script>
<template>
    <a-row>
        <a-col v-for="contract in contractStore.contracts" :span="24">
            <a-card>
                {{ contract }}
            </a-card>
        </a-col>
    </a-row>
</template>