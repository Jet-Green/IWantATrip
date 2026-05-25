<script setup>
import { onMounted, ref } from 'vue'
import { useTrips } from '../../stores/trips';
import { useRouter } from "vue-router";


let router = useRouter();
let tripStore = useTrips()
let rejectedTrips = ref([])

const clearData = (dataString) => {
    let date
    dataString = String(dataString)
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

async function tripToDelete(_id) {
    let response = await tripStore.deleteById(_id);
    await refreshRejectedTrips()
}

async function refreshRejectedTrips() {
    let rejected = await tripStore.findRejectedTrips()
    rejectedTrips.value = rejected.data
}

onMounted(async () => {
    refreshRejectedTrips()
})
</script>
<template>
    <a-row :gutter="[8, 8]" class="mt-8">
        <a-col :lg="8" :sm="12" :xs="24" v-if="rejectedTrips.length > 0" v-for="(trip, index) of rejectedTrips"
            :key="index">
            <a-card class="card" hoverable>
                <div style="text-align:center">
                    {{ trip.name }}
                </div>
                <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
                <div v-if="trip?.startLocation?.name">
                    <MdiIcon name="compass-outline" /> {{ trip.startLocation.name }}
                </div>
                <div>
                    <MdiIcon name="calendar-arrow-right" />
                    {{ `c ${clearData(trip.start)}` }}
                    <MdiIcon name="calendar-arrow-left" />
                    {{ `по ${clearData(trip.end)}` }}
                </div>
                <div class="mt-8">Автор: {{ trip.author.fullinfo.fullname }}</div>

                <div class="actions d-flex justify-center">
                    <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="tripToDelete(trip._id)"
                        v-if="!trip.billsList.length > 0">
                        <MdiIcon style="color: #ff6600; cursor: pointer" name="delete" />
                    </a-popconfirm>
                    <MdiIcon @click="router.push(`/trip-moderation?_id=${trip._id}`)"
                        style="color: #245159; cursor: pointer" name="check-decagram-outline" />
                </div>
            </a-card>
        </a-col>
        <a-col :span="24" v-else>
            Нет отказаных туров
        </a-col>
    </a-row>
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
</style>
