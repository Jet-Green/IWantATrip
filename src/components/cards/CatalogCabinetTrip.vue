<script setup>
import { toRefs } from 'vue';
import TripService from '../../service/TripService';

import { useRouter } from 'vue-router';

const props = defineProps(['trip'])
let router = useRouter()
let emit = defineEmits(['deleteTrip'])

let { trip } = toRefs(props)

function goToCopyCatalog() {
    router.push(`/catalog-to-active?_id=${trip.value._id}`)
}

async function deleteCatalogTrip(_id) {
    let response = await TripService.catalogToDelete(_id)
    if (response.status == 200) {
        emit('deleteTrip')
    }
}
async function hideTrip(_id) {
    trip.value.isHidden = !trip.value.isHidden;
    TripService.hideCatalogTrip(_id, trip.value.isHidden);
}
</script>

<template>
    <a-card class="card" hoverable :class="[trip.isHidden ? 'overlay' : '']">
        <div class="d-flex">
            <div style="width:100%;text-align:center">{{ trip.name }}</div>
        </div>
        <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
        <div>
            <span class="mdi mdi-compass-outline"> </span>{{ trip.startLocation.name }}
        </div>

        <div class="actions d-flex justify-center">

            <span class="mdi mdi-pencil" style="cursor: pointer" @click="router.push({ name: 'EditCatalogTrip',query: { id: trip._id }})"></span>
            <a-popconfirm title="В активные?" ok-text="Да" cancel-text="Нет" @confirm="goToCopyCatalog">
                <span class="mdi mdi-plus-circle-outline" style="cursor: pointer"></span>
            </a-popconfirm>
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="hideTrip(trip._id)">
                <span v-if="!trip.isHidden" class="mdi mdi-eye-outline" style="cursor: pointer"></span>
                <span v-else class="mdi mdi-eye-off-outline" style="cursor: pointer"></span>
            </a-popconfirm>
            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="deleteCatalogTrip(trip._id)">
                <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
            </a-popconfirm>
        </div>
        <div v-if="trip.moderationMessage && trip.rejected && !trip.isModerated">
            {{ trip.moderationMessage }}
        </div>
    </a-card>
</template>

<style scoped lang="scss">
.card{
    height: 100%;
}
.actions {
    font-size: 20px;
    position: relative;
    color: #245159;

    * {
        margin: 4px;
        cursor: pointer;
    }
}

.overlay {

    opacity: 0.5;

}
</style>