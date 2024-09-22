<script setup>
import { onMounted, ref } from 'vue'
import { useTrips } from '../../../stores/trips';
import { useRouter } from 'vue-router'

let tripStore = useTrips()
let catalogTripsOnMod = ref([])
let router = useRouter()

async function catalogToDelete(_id) {
    let response = await tripStore.catalogToDelete(_id);
    await refreshCatalogTripsOnModeration()
}

async function refreshCatalogTripsOnModeration() {
    let { data } = await tripStore.findCatalogForModeration()
    catalogTripsOnMod.value = data
}

onMounted(async () => {
    await refreshCatalogTripsOnModeration()
})
</script>
<template>
    <a-row :gutter="[8, 8]" class="mt-8">

        <a-col :lg="8" :sm="12" :xs="24" v-if="catalogTripsOnMod.length > 0"
       
            v-for="(catalog, index) of catalogTripsOnMod" :key="index">
     
            <a-card class="card" hoverable>
                <div style="text-align:center">
                    {{ catalog?.name }}
                </div>
                <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
                <div>
                    <span class="mdi mdi-compass-outline"></span> {{ catalog?.startLocation.name }}
                </div>
                <div class="mt-8">Автор: {{ catalog?.author.fullinfo.fullname }}</div>
                <div class="actions d-flex justify-center">
                    <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет"
                        @confirm="catalogToDelete(catalog._id)">
                        <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
                    </a-popconfirm>
                    <span class="mdi mdi-check-decagram-outline"
                        @click="router.push(`/catalog-trip-moderation?_id=${catalog._id}`)"
                        style="color: #245159; cursor: pointer"></span>
                </div>
            </a-card>
        </a-col>
        <a-col :span="24" v-else>
            Нет туров
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