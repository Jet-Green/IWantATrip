<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

let tripsStatus = ref('tripsOnModeration')
let router = useRouter();

watch(tripsStatus, (status) => {
    localStorage.setItem("moderationTripsStatus", status)
    if (status === 'tripsOnModeration') {
        return router.push('/cabinet/catalog-trips-moderation/on-moderation')
    }
    if (status === 'rejected') {
        return router.push('/cabinet/catalog-trips-moderation/rejected')
    }
});
onMounted(() => {
    tripsStatus.value = localStorage.getItem("moderationTripsStatus") ? localStorage.getItem("moderationTripsStatus") : 'tripsOnModeration'
});
</script>

<template>
    <a-row>
        <a-col :span="24">
            <h3>Туры в каталоге на модерации</h3>
            <a-radio-group v-model:value="tripsStatus">
                <a-radio value="tripsOnModeration">На модерации</a-radio>
                <a-radio value="rejected">Откaзaнные</a-radio>
            </a-radio-group>

            <router-view />

        </a-col>
    </a-row>
</template>
