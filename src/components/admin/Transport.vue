<script setup>
import { ref, onMounted } from 'vue'
import { useAppState } from '../../stores/appState';

let appStateStore = useAppState()

onMounted(async () => {
    if (!appStateStore.appState) {
        await appStateStore.refreshState();
    }
})
</script>
<template>
    <div>
        <a-col :span="24" class="mb-8 d-flex space-between">
            <h2>Такси</h2>
            <a-button type="primary" class="lets_go_btn mt-8">
                <span class="mdi mdi-taxi mr-4"></span> Добавить
            </a-button>
        </a-col>

        <a-row :gutter="[16, 16]" type="flex" justify="center">
            <a-col v-for="t of appStateStore.appState[0].taxi" :xs="24" :sm='12' :md="8" :lg="6">
                <a-card style="padding: 30px; text-align: center; border-radius: 5px;">
                    {{ t.name }} <b>{{ t.number }}</b>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>
