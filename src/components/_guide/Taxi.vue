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
            <a-row :gutter="[16, 16]" type="flex" justify="center">
                <a-col v-for="t of appStateStore.appState[0].taxi" :xs="24" :sm='12' :md="8" :lg="6">
                    <a-card hoverable style="padding: 30px; text-align: center; border-radius: 5px;">
                        {{ t.name }} <br />
                        <b> <span class="mdi mdi-phone-in-talk"></span>{{ t.number }}</b>
                    </a-card>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>