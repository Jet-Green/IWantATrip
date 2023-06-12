<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import TripService from "../../service/TripService";
import { useTrips } from '../../stores/trips';

let props = defineProps(['trip', 'actions'])
let { actions, trip } = props
let router = useRouter()
let tripStore = useTrips()

const clearData = (dataString) => {
    let date
    if (dataString.length == 13) {
        const dataFromString = new Date(Number(dataString));
        date = dataFromString

    } else {
        date = new Date(dataString)
    };
    return date.toLocaleDateString("ru-Ru", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",

    })
}
function editTrip(_id) {
    router.push(`/edit-trip?_id=${_id}`);
}

function copyTrip(_id) {
    router.push({name:`CreateTripNoHelp`, query: { id: _id }});
}
async function hideTrip(_id) {
    trip.isHidden = !trip.isHidden;
    TripService.hideTrip(_id, trip.isHidden);
}
function goToTripPage(_id) {
    router.push(`/trip?_id=${_id}`);
}
async function tripToDelete(_id) {
    let { response } = await tripStore.deleteById(_id);
    let { status } = response

    if (status != "400") {
        trip = {}
    }
}
let showMessage = ref(false);
</script>
<template>
    <a-card class="card " hoverable :class="[trip.isHidden ? 'overlay' : '']" v-if="trip._id">
        <div style="text-align:center">
            {{ trip.name }}
        </div>
        <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
        <div>
            <span class="mdi mdi-compass-outline"></span>{{ trip.startLocation.name }}
        </div>
        <div>
            <span class="mdi mdi-calendar-arrow-right"></span>
            {{ `c ${clearData(trip.start)}` }}
            <span class="mdi mdi-calendar-arrow-left"></span>
            {{ `по ${clearData(trip.end)}` }}
        </div>

        <div class="actions d-flex justify-center">
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="tripToDelete(trip._id)"
                v-if="(!trip.billsList?.length > 0) && actions.includes('delete')">
                <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
            </a-popconfirm>
            <a-popconfirm v-if="actions.includes('edit')" title="Вы уверены?" ok-text="Да" cancel-text="Нет"
                @confirm="editTrip(trip._id)">
                <span class="mdi mdi-pen" style="color: #245159; cursor: pointer"></span>
            </a-popconfirm>
            <a-popconfirm v-if="actions.includes('hide')" title="Вы уверены?" ok-text="Да" cancel-text="Нет"
                @confirm="hideTrip(trip._id)">
                <span v-if="!trip.isHidden" class="mdi mdi-eye" style="color: #245159; cursor: pointer"></span>
                <span v-else class="mdi mdi-eye-off" style="color: #245159; cursor: pointer"></span>
            </a-popconfirm>
            <a-popconfirm v-if="actions.includes('copy')" title="Вы уверены?" ok-text="Да" cancel-text="Нет"
                @confirm="copyTrip(trip._id)">
                <span class="mdi mdi-content-copy" style="color: #245159; cursor: pointer"></span>
            </a-popconfirm>
            <span class="mdi mdi-information-outline"
                @click="router.push({ path: 'customers-trip', query: { _id: trip._id } })"
                v-if="actions.includes('info')"></span>
            <span class="mdi mdi-email-outline" v-if="trip.moderationMessage && actions.includes('msg')"
                @click="showMessage = !showMessage"></span>
        </div>
        <div v-if="showMessage">
            Замечания: {{ trip.moderationMessage }}
        </div>
    </a-card>
</template>
<style scoped lang="scss">
.actions {
    font-size: 20px;
    position: relative;

    * {
        margin: 4px;
        cursor: pointer;
    }
}



.overlay {

    opacity: 0.5;

}
</style>