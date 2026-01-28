<script setup>
import { ref, onMounted,watch } from 'vue'
import { useRouter } from 'vue-router';
import { useAppState } from '../../stores/appState';
import Bus from '../Bus.vue';
import { useBus } from '../../stores/bus';
import ExcursionTypes from './ExcursionTypes.vue';
import LocationsImage from './LocationsImage.vue';

import { message } from 'ant-design-vue';

let router = useRouter()
let appStateStore = useAppState()
let tripType = ref('')
let placeCategory = ref('')
let buses = ref()
// Регион тура, выбирается при создании тура (На море, Кавказ, Урал, Кунгурские пещеры). 
// Нужен для более удобного поиска по турам.
let tripRegion = ref('')

async function addTripType() {
    if (tripType.value.length > 2) {
        let res = await appStateStore.addTripType(tripType.value.toLowerCase().trim())
        if (res.status == 200) {
            await appStateStore.refreshState();
        }
    } else {
        message.config({ duration: 2 });
        message.error({ content: 'Слишком короткое название типа тура' });
    }
}

async function addPlaceCategory () {
    if (placeCategory.value.length > 2) {
        let res = await appStateStore.addPlaceCategory(placeCategory.value.toLowerCase().trim())
        if (res.status == 200) {
            placeCategory.value = ''
            await appStateStore.refreshState();
        }
    } else {
        message.config({ duration: 2 });
        message.error({ content: 'Слишком короткое название места' });
    }
}

async function deletePlaceCategory(placeCategory) {
    let res = await appStateStore.deletePlaceCategory(placeCategory)
    
    if (res.status == 200) {
        await appStateStore.refreshState();
    }
}

async function deleteBus(_id) {
    let res = await useBus().deleteBus(_id)
    buses.value = await useBus().get()
}

async function addTripRegion() {
    if (tripRegion.value.length > 2 && tripRegion.value.length <= 35) {
        let res = await appStateStore.addTripRegion(tripRegion.value.trim())
        if (res.status == 200) {
            message.config({ duration: 3 });
            message.success({ content: `Регион "${tripRegion.value}" создан` });         
            await appStateStore.refreshState();
            tripRegion.value = ''
        } else {
            message.config({ duration: 3 });
            message.error({ content: 'Ошибка при создании региона' });
        }
    } else if (tripRegion.value.length > 35) {
        message.config({ duration: 2 });
        message.error({ content: 'Слишком длинное название региона' });
    } else {
        message.config({ duration: 2 });
        message.error({ content: 'Слишком короткое название региона' });
    }
}

async function deleteTripRegion(tripRegionName) {
    let res = await appStateStore.deleteTripRegion(tripRegionName)
    
    if (res.status == 200) {
        await appStateStore.refreshState();
    }
}


onMounted(async () => {
    if (!appStateStore.appState) {
        await appStateStore.refreshState();
    }
    buses.value = await useBus().get()
})
</script>
<template>
    <a-row class="mb-16">
        <a-col :span="24">
            <ExcursionTypes />
        </a-col>
    </a-row>
    <a-row class="mb-16">
        <a-col :span="24">
            <a-row>
                <a-col :span="24">
                    <h3>Тип тура</h3>
                </a-col>
                <a-col :span="24" class="d-flex align-center">
                    <a-input placeholder="Пляжный" size="large" v-model:value="tripType"></a-input>
                    <a-button type="primary" class="ml-12 lets_go_btn" @click="addTripType">добавить</a-button>
                </a-col>
                <a-col v-for="t of appStateStore?.appState[0]?.tripType" class="ma-8" style="cursor: pointer">
                    <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                        @confirm="() => { appStateStore.deleteTripType(t) }">
                        <div class="name-wrapper">{{ t }}</div>
                    </a-popconfirm>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
    <a-row class="mb-24">
        <a-col :span="24">
            <h3>Регионы</h3>
        </a-col>
        <a-col :span="24" class="d-flex align-center">
            <a-input placeholder="На море, Кавказ, Урал, Кунгурские пещеры" size="large" v-model:value="tripRegion"></a-input>
            <a-button type="primary" class="ml-12 lets_go_btn" @click="addTripRegion">добавить</a-button>
        </a-col>
        <a-col v-for="region of appStateStore?.appState[0]?.tripRegions" class="ma-8" style="cursor: pointer">
            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                @confirm="() => { deleteTripRegion(region) }">
                <div class="name-wrapper">{{ region }}</div>
            </a-popconfirm>
        </a-col>
    </a-row>
    <a-row class="mb-24">
        <a-col :span="24">
            <h3>Категории интересных мест</h3>

        </a-col>
        <a-col :span="24" class="d-flex align-center">
            <a-input placeholder="Памятник, музей, водопад" size="large" v-model:value="placeCategory"></a-input>
            <a-button type="primary" class="ml-12 lets_go_btn" @click="addPlaceCategory()">добавить</a-button>
        </a-col>
        <a-col v-for="place of appStateStore?.appState[0]?.placeCategory" class="ma-8" style="cursor: pointer">
            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                @confirm="() => { deletePlaceCategory(place) }">
                <div class="name-wrapper">{{ place }}</div>
            </a-popconfirm>
        </a-col>
    </a-row>
    <a-row class="mb-24">
        <LocationsImage />
    </a-row>


    <a-row class="mb-24">
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