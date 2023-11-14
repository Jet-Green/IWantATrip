<script setup>
import { onMounted } from 'vue'
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
    <div>
        <BackButton />

        <a-row type="flex" justify="center">
            <a-col :xs="22" :lg="16">
                <h2>Такси</h2>
                <a-row :gutter="[16, 16]" class="mt-3" type="flex" justify="center">
                    <a-col v-for="t of appStateStore.appState[0].taxi" :xs="24" :sm='12' :md="8" :lg="6">
                        <a-card hoverable style="padding:20px 30px; border-radius: 5px;">
                            <b>{{ t.name }}</b> <br />
                            <a href="tel:" class="number">
                                <span class="mdi mdi-phone-in-talk"></span> {{ t.number }}
                            </a>
                        </a-card>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>
<style>
b {
    font-size: 23px;
}
.number {
    font-size: 16px;
}
</style>