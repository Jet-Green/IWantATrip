<script setup>
import { ref } from 'vue'
import { useAppState } from '../../stores/appState';

let appStateStore = useAppState()
let tripType = ref('')

async function addTripType() {
    let res = await appStateStore.addTripType(tripType.value)
    if (res.status == 200) {
        appStateStore.appState[0].tripType.push(tripType.value)
    }
}
</script>
<template>
    <a-row>
        <a-col :span="24">
            <a-row>
                <a-col :span="24">
                    <h3>Тип тура</h3>
                </a-col>
                <a-col :span="24" class="d-flex">
                    <a-input placeholder="Пляжный" size="large" v-model:value="tripType"></a-input>
                    <a-button size="large" type="primary" class="ml-12" @click="addTripType">добавить</a-button>
                </a-col>
                <a-col v-for="t of appStateStore.appState[0].tripType" class="ma-8" style="cursor: pointer">
                    <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                        @confirm="() => { appStateStore.deleteTripType(t) }">
                        {{ t }}
                    </a-popconfirm>

                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>