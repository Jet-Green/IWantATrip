<script setup>
import { onMounted, ref, watch } from 'vue'
import BackButton from '../BackButton.vue';

import { useRouter } from 'vue-router';

const router = useRouter()

let { booking_id } = router.currentRoute.value.query
let offerStatus = ref('new')

watch(offerStatus, (newValue) => {
    router.push(`/offers/${newValue}?booking_id=${booking_id}`)
})

onMounted(() => {
    // /offers/new -> path[2] === new
    let path = router.currentRoute.value.path.split('/')[2]
    offerStatus.value = path
})
</script>
<template>
    <div>
        <BackButton :backRoute="{ path: '/cabinet/booking-trips' }" />
        <a-row type="flex" justify="center" style="margin-bottom: 44px;">
            <a-col :xs="22" :lg="16">
                <h3>Предложения</h3>
                <a-radio-group v-model:value="offerStatus">
                    <a-radio value="new">Новые</a-radio>
                    <a-radio value="accepted">Принятые</a-radio>
                    <a-radio value="rejected">Отклонённые</a-radio>
                </a-radio-group>

                <router-view />
            </a-col>
        </a-row>
    </div>
</template>