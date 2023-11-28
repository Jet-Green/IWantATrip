<script setup>
import { ref, onMounted } from 'vue'
import { useGuide } from '../../stores/guide';

let guideStore = useGuide()

let addTaxiModal = ref(false)
let taxi = ref({})

let localTaxi = ref({})

async function addTaxi() {
    if (taxi.value.name.length > 2 && taxi.value.phone.length > 2) {
        let location = {}
        if (localStorage.getItem("location")) {
            location = JSON.parse(localStorage.getItem("location"))
            taxi.value.location = location
        }
        let res = await guideStore.addTaxi(taxi.value)
        addTaxiModal.value = false;
        taxi.value = {}
        if (res.status == 200) {
            rafreshTaxi()
        }
    }
}

let refreshTaxi = async () => {
    let res = await guideStore.getLocalTaxi()
    localTaxi.value = res.data
}
let deleteTaxi = async (name) => {
    await guideStore.deleteTaxi(name)
    rafreshTaxi()
}

onMounted(async () => {
    await refreshTaxi()
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
        <a-row v-if="localTaxi" :gutter="[16, 16]" class="mt-3" type="flex" justify="center">
            <a-col v-for="(t, i) in localTaxi" :xs="12" :md="6" :lg="6">
                <a-card hoverable style="padding:10px 10px; border-radius: 10px; font-size:18px;">
                    <b>{{ t.name }}</b> <br />
                    <span class="mdi mdi-phone-in-talk"></span> {{ t.phone }}<br />
                    {{ t.location.name }}
                    <div class="actions d-flex justify-center">
                        <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="deleteTaxi(t.name)">
                            <span class="mdi mdi-delete" style=" cursor: pointer"></span>
                        </a-popconfirm>
                    </div>
                </a-card>
            </a-col>
        </a-row>
        <a-row v-else>
            В выбраном месте нет такси.
        </a-row>
        <a-modal v-model:open="addTaxiModal" :footer="null" title="Добавить такси">
            <a-row :gutter="[4, 24]">
                <a-col :span="24" :md="12">
                    Название
                    <a-input style="width: 100%" v-model:value="taxi.name" placeholder="Драйв" />
                </a-col>
                <a-col :span="24" :md="12">
                    Телефон
                    <a-input style="width: 100%" v-model:value="taxi.phone" placeholder="79127528874" />
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
    color: black;

    * {
        cursor: pointer;
    }
}


</style>
