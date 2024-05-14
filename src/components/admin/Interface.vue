<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useAppState } from '../../stores/appState';
import Bus from '../Bus.vue';
import { useBus } from '../../stores/bus';

let router = useRouter()
let appStateStore = useAppState()
let tripType = ref('')
let transport = ref({})
let taxi = ref({})
let buses = ref()

async function addTripType() {
    if (tripType.value.length > 2) {
        let res = await appStateStore.addTripType(tripType.value)
        if (res.status == 200) {
            await appStateStore.refreshState();
        }
    }
}
async function addTransportName() {
    if (transport.value.name.length > 2) {
        let res = await appStateStore.addTransportName(transport.value.name)
        if (res.status == 200) {
            await appStateStore.refreshState();
        }
    }
}

async function deleteBus(_id) {
    let res = await useBus().deleteBus(_id)
    buses.value = await useBus().get()
}

onMounted(async () => {
    if (!appStateStore.appState) {
        await appStateStore.refreshState();
    }
    buses.value = await useBus().get()
})
</script>
<template>
    <a-row>
        <a-col :span="24">
            <a-row>
                <a-col :span="24">
                    <h3>Тип тура</h3>
                </a-col>
                <a-col :span="24" class="d-flex align-center">
                    <a-input placeholder="Пляжный" size="large" v-model:value="tripType"></a-input>
                    <a-button type="primary" class="ml-12 lets_go_btn" @click="addTripType">добавить</a-button>
                </a-col>
                <a-col v-for="t of appStateStore.appState[0].tripType" class="ma-8" style="cursor: pointer">
                    <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                        @confirm="() => { appStateStore.deleteTripType(t) }">
                        <div class="name-wrapper">{{ t }}</div>
                    </a-popconfirm>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="24">
            <a-row>
                <a-col :span="24">
                    <h3>Транспорт</h3>
                </a-col>
                <a-col :span="24" class="d-flex align-center">
                    <a-input placeholder="Легковой" size="large" v-model:value="transport.name"></a-input>
                    <a-button type="primary" class="ml-12 lets_go_btn" @click="addTransportName">добавить</a-button>
                </a-col>
                <a-col v-for="t of appStateStore.appState[0].transport" class="ma-8" style="cursor: pointer">
                    <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                        @confirm="() => { appStateStore.deleteTransportName(t.name) }">
                        <div class="name-wrapper"> {{ t.name }}</div>
                    </a-popconfirm>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="24">
            <a-row>
                <a-col :span="24">
                    <h3>Автобусы</h3>
                </a-col>
                <a-col :span="24" class="d-flex justify-end pa-4">
                    <a-button type="primary" class="lets_go_btn" @click="router.push('/create-bus')">создать</a-button>
                </a-col>
                <a-col :span="24">
                    <a-row :gutter=[4,4]>
                        <a-col :span="4" v-for="bus in buses">
                            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="() => deleteBus(bus._id)">
                                <Bus :bus="bus" preview />
                            </a-popconfirm>                            
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>
<style lang="scss" scoped>
.name-wrapper {
    min-height: 10px;
    min-width: 10px;
    background: rgb(235, 235, 235);
}
</style>