<script setup>
import { onMounted, ref } from 'vue'
import { useTrips } from '../../stores/trips'
import OrderCard from "../cards/OrderCard.vue"

const tripStore = useTrips()

let open = ref([])
let inWork = ref([])
let closed = ref([])

let activeKey = ref(1)

onMounted(async () => {
    open.value = await tripStore.getBookingTrips('open')
    inWork.value = await tripStore.getBookingTrips('inWork')
    closed.value = await tripStore.getBookingTrips('closed')
})
</script>
<template>
    <h3>Заказы</h3>
    <a-collapse v-model:activeKey="activeKey" ghost>
        <a-collapse-panel key="1" header="Новые">
            <a-row :gutter="[8, 8]" class="mt-8">
                <a-col :lg="8" :sm="12" :xs="24" v-for="booking in open" v-if="open.length">
                    <OrderCard :booking="booking" />
                </a-col>
                <a-col v-else>
                    <span>У вас нет новых заказов</span>
                </a-col>
            </a-row>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="В работе">
            <a-row :gutter="[8, 8]" class="mt-8">
                <a-col :lg="8" :sm="12" :xs="24" v-for="booking in inWork" v-if="inWork.length">
                    <OrderCard :booking="booking" />
                </a-col>
                <a-col v-else>
                    <span>У вас нет заказов в работе</span>
                </a-col>
            </a-row>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="Завершены">
            <a-row :gutter="[8, 8]" class="mt-8">
                <a-col :lg="8" :sm="12" :xs="24" v-for="booking in closed" v-if="closed.length">
                    <OrderCard :booking="booking" />
                </a-col>
                <a-col v-else>
                    <span>У вас нет закрытых заказов</span>
                </a-col>
            </a-row>
        </a-collapse-panel>
    </a-collapse>
</template>
<style lang="scss" scoped></style>