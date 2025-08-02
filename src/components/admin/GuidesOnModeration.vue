<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

let guidesStatus = ref('guidesOnModeration')
let router = useRouter();

watch(guidesStatus, (status) => {
    localStorage.setItem("moderationGuidesStatus", status)
    if (status === 'guidesOnModeration') {
        return router.push('/cabinet/moderation-guides/on-moderation')
    }
    if (status === 'rejected') {
        return router.push('/cabinet/moderation-guides/rejected')
    }
    if (status === 'manage') {
        return router.push('/cabinet/moderation-guides/manage')
    }
});
onMounted(() => {
    guidesStatus.value = localStorage.getItem("moderationGuidesStatus") ? localStorage.getItem("moderationGuidesStatus") : 'guidesOnModeration'
});
</script>
<template>
    <a-row>
        <a-col :span="24">
            <h3>Гиды на модерации</h3>
            <a-radio-group v-model:value="guidesStatus">
                <a-radio value="guidesOnModeration">На модерации</a-radio>
                <a-radio value="rejected">Откaзaнные</a-radio>
                <a-radio value="manage">Управление</a-radio>
            </a-radio-group>

            <router-view />

        </a-col>
    </a-row>
</template>
