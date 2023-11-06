<script setup>
import { ref, onMounted } from 'vue'
import { useAppState } from '../../stores/appState';

let appStateStore = useAppState()

import BackButton from "../BackButton.vue";

onMounted(async () => {
    if (!appStateStore.appState) {
        await appStateStore.refreshState();
    }
})
</script>
<template>
    <BackButton />

    <a-row type="flex" justify="center">
        <a-col :xs="22" :lg="16">
            <h2>Такси</h2>
        </a-col>
    </a-row>
</template>