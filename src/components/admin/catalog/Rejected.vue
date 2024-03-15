<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from "vue-router";
import { useTrips } from "../../../stores/trips";


let router = useRouter();
const TripStore = useTrips();
let rejectedCatalog = ref([])

async function catalogToDelete(_id) {
    let response = await TripStore.catalogToDelete(_id);
    await refreshrejected()
}

async function refreshrejected() {
    let rejected = await TripStore.findRejectedCatalog()
    rejectedCatalog.value = rejected.data
}

onMounted(async () => {
    refreshrejected();
})
</script>
<template>
    <a-row :gutter="[8, 8]" class="mt-8">
        <a-col :lg="8" :sm="12" :xs="24" v-if="rejectedCatalog.length > 0" v-for="(catalog, index) of rejectedCatalog"
            :key="index">
            <a-card class="card" hoverable>
                <div style="text-align:center">
                    {{ catalog.name }}
                </div>
                <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
                <div>
                    <span class="mdi mdi-compass-outline"></span> {{ catalog.startLocation.name }}
                </div>
                <div class="mt-8">Автор: {{ catalog.author.fullinfo.fullname }}</div>
                <div class="actions d-flex justify-center">
                    <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="catalogToDelete(catalog._id)">
                        <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
                    </a-popconfirm>
                    <span class="mdi mdi-check-decagram-outline"
                        @click="router.push(`/catalog-trip-moderation?_id=${catalog._id}`)"
                        style="color: #245159; cursor: pointer"></span>
                </div>
            </a-card>
        </a-col>
        <a-col :span="24" v-else>
            Нет отказаных туров в каталоге
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
