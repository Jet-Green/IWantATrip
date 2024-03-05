<script setup>
import { toRefs } from 'vue';
import TripService from '../../service/TripService';

import { useRouter } from 'vue-router';

const props = defineProps(['trip'])
let router = useRouter()

let { trip } = toRefs(props)

async function hideTrip(_id) {
    trip.value.isHidden = !trip.value.isHidden;
    TripService.hideTrip(_id, trip.value.isHidden);
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
            <a-popconfirm title="В активные?" ok-text="Да" cancel-text="Нет" @confirm="() => { router.push('/') }">
                <span class="mdi mdi-plus-circle-outline" style="cursor: pointer"></span>
            </a-popconfirm>
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="hideTrip(trip._id)">
                <span v-if="!trip.isHidden" class="mdi mdi-eye-outline" style="cursor: pointer"></span>
                <span v-else class="mdi mdi-eye-off-outline" style="cursor: pointer"></span>
            </a-popconfirm>
        </div>
    </a-card>
</template>
<style scoped lang="scss">
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