<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

let tripsStatus = ref('tripsOnModeration')
let router = useRouter();

watch(tripsStatus, (status) => {
    if (status === 'tripsOnModeration') {
        return router.push('/cabinet/moderation-trips/not-moderated-trips')
    }
    if (status === 'rejected') {
        return router.push('/cabinet/moderation-trips/rejected-trips')
    }
})
</script>
<template>
    <a-row>
        <a-col :span="24">
            <h3>Туры на модерации</h3>
            <a-radio-group v-model:value="tripsStatus">
                <a-radio value="tripsOnModeration">На модерации</a-radio>
                <a-radio value="rejected">Откaзaнные</a-radio>
            </a-radio-group>
            <a-row>
                <router-view />
            </a-row>
        </a-col>
    </a-row>
</template>
