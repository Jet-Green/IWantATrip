<script setup>
import { onMounted, ref, watch } from 'vue'
import { useTrips } from '../../stores/trips'
import OrderCard from "../cards/OrderCard.vue"

const tripStore = useTrips()

let orders = ref([])
let status = ref('open')

let deleteOrder = async (_id) => {
    await tripStore.deleteOrder(_id)
    orders.value = await tripStore.getBookingTrips(status.value)
}


let changeStatus = async (bookingId) => {
    switch (status.value) {
        case "open":
            await tripStore.changeBookStatus(bookingId, "inWork")
            status.value = "inWork"
            break;
        case "inWork":
            await tripStore.changeBookStatus(bookingId, 'closed')
            status.value = "closed"
            break;
        case "closed":
            await tripStore.changeBookStatus(bookingId, 'inWork')
            status.value = "inWork"
            break;
        default:
            console.log("Неизвестный статус");
    }
    orders.value = await tripStore.getBookingTrips(status.value)
}
async function editComment(booking) {
    await tripStore.updateBooking(booking)
    orders.value = await tripStore.getBookingTrips(status.value)
}


watch(status, async () => {
    orders.value = await tripStore.getBookingTrips(status.value)
})


onMounted(async () => {
    orders.value = await tripStore.getBookingTrips('open')
})
</script>
<template>
    <h3>Заказы</h3>

    <a-row>
        <a-col :cols="24" class="d-flex space-between align-center flex-wrap">

            <a-radio-group v-model:value="status">
                <a-radio value="open">Новые</a-radio>
                <a-radio value="inWork">В работе</a-radio>
                <a-radio value="closed">Закрыты</a-radio>

            </a-radio-group>
        </a-col>
    </a-row>
    <a-row :gutter="[8, 8]" class="mt-16">

        <a-col :md="8" :sm="12" :xs="24" v-for="booking in orders" v-if="orders.length">

            <OrderCard :booking="booking">
                <slot>
                    <div class="actions d-flex justify-center">
                        <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                            @confirm="deleteOrder(booking._id)">

                            <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
                        </a-popconfirm>
                        <a-popconfirm title="Обновить комментарий?" ok-text="Да" cancel-text="Нет"
                            @confirm="editComment(booking)">

                            <span class="mdi mdi-reload" style=" cursor: pointer"></span>
                        </a-popconfirm>
                        <a-popconfirm title="Изменить статус?" ok-text="Да" cancel-text="Нет"
                            @confirm="changeStatus(booking._id)">
                            <span v-if="status == 'closed'" class="mdi mdi-arrow-left" style="cursor: pointer"></span>
                            <span v-else class="mdi mdi-arrow-right" style="cursor: pointer"></span>
                        </a-popconfirm>

                    </div>
                    <div class="mt-8">
                        <a-textarea placeholder="Заметка" v-model:value="booking.comment"
                            :auto-size="{ minRows: 1 }"></a-textarea>
                    </div>
                </slot>
            </OrderCard>

        </a-col>
        <a-col v-else>
            <span>Нет заказов</span>
        </a-col>


    </a-row>



</template>
<style lang="scss" scoped>
.actions {
    font-size: 20px;
    position: relative;
    color: #245159;

    * {
        margin: 4px;
        cursor: pointer;
    }
}
</style>