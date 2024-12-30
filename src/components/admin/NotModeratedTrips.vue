<script setup>
import { onMounted, ref } from 'vue'
import { useTrips } from '../../stores/trips';
import { useRouter } from 'vue-router'

let tripStore = useTrips()
let tripsOnMod = ref([])
let router = useRouter()

async function tripToDelete(_id) {
    await tripStore.deleteById(_id);
    await refreshTripsOnModeration()
}
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
async function refreshTripsOnModeration() {
    let { data } = await tripStore.findForModeration()
    tripsOnMod.value = data
}

onMounted(async () => {
    await refreshTripsOnModeration()
})
</script>
<template>
    <a-row :gutter="[8, 8]" class="mt-8">
        <a-col :lg="8" :sm="12" :xs="24" v-if="tripsOnMod.length > 0" v-for="(trip, index) of tripsOnMod" :key="index">
            <a-card class="card" hoverable>
                <div style="text-align:center">
                    {{ trip.name }}
                </div>
                <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
                <div>
                    <!-- <span class="mdi mdi-compass-outline"></span> {{ trip.startLocation.name }} -->
                    <span class="mdi mdi-compass-outline"></span> {{ trip.startLocation?.name ? trip.startLocation.name : "Не указано" }}
                </div>
                <div>
                    <span class="mdi mdi-calendar-arrow-right"></span>
                    {{ `c ${clearData(trip.start)}` }}
                    <span class="mdi mdi-calendar-arrow-left"></span>
                    {{ `по ${clearData(trip.end)}` }}
                </div>
                <div class="mt-8">Автор: {{ trip.author.fullinfo.fullname }}</div>

                <div class="actions d-flex justify-center">
                    <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="tripToDelete(trip._id)"
                        v-if="!trip.billsList.length > 0">
                        <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
                    </a-popconfirm>
                    <span class="mdi mdi-check-decagram-outline" @click="router.push(`/trip-moderation?_id=${trip._id}`)"
                        style="color: #245159; cursor: pointer"></span>
                </div>
            </a-card>
        </a-col>
        <a-col :span="24" v-else>
            Нет туров на модерации
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