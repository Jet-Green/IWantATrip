<script setup>
import { ref, onMounted } from 'vue'
import { useAppState } from '../../stores/appState';

let appStateStore = useAppState()

let addTaxiModal = ref(false)
let taxi = ref({})

async function addTaxi() {
    if (taxi.value.name.length > 2 && taxi.value.number.length > 2) {
        let res = await appStateStore.addTaxi(taxi.value.name, taxi.value.number)
        addTaxiModal.value = false;
        taxi.value = {}
        if (res.status == 200) {
            await appStateStore.refreshState();
        }
    }
}


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
            <a-button @click="addTaxiModal = true" type="primary" class="lets_go_btn mt-8">
                <span class="mdi mdi-taxi mr-4"></span> Добавить
            </a-button>
        </a-col>

        <a-row :gutter="[16, 16]" type="flex" justify="center">
            <a-col v-for="t of appStateStore.appState[0].taxi" :xs="24" :sm='12' :md="8" :lg="6">
                <a-card hoverable style="padding: 15px; text-align: center; border-radius: 5px;">
                    {{ t.name }} <br />
                    <b> <span class="mdi mdi-phone-in-talk"></span>{{ t.number }}</b>
                    <div class="actions d-flex justify-center">
                        <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет"
                            @confirm="appStateStore.deleteTaxi(t.name)">
                            <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
                        </a-popconfirm>
                    </div>
                </a-card>
            </a-col>
        </a-row>
        <a-modal v-model:open="addTaxiModal" :footer="null" title="Добавить такси">
            <a-row :gutter="[4, 24]">
                <a-col :span="24" :md="12">
                    Название
                    <a-input style="width: 100%" v-model:value="taxi.name" placeholder="Драйв" />
                </a-col>
                <a-col :span="24" :md="12">
                    Телефон
                    <a-input style="width: 100%" v-model:value="taxi.number" placeholder="79127528874" />
                </a-col>
                <a-col :span="24">
                    <a-button type="primary" @click="addTaxi()"> добавить </a-button>
                </a-col>
            </a-row>
        </a-modal>
    </div>
</template>
<style>
.actions {
    font-size: 20px;
    position: relative;
    color: #245159;

    * {
        cursor: pointer;
    }
}
</style>
