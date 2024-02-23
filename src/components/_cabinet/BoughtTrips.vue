<script setup>
import tinkoffPlugin from '../../plugins/tinkoff';
import { onMounted, ref } from 'vue';
import { useTrips } from '../../stores/trips'

const tripStore = useTrips()

let bought = ref([])

const clearData = (dateNumber) => {
    let date = new Date(dateNumber).toLocaleDateString("ru-Ru", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    });
    if (date !== "Invalid Date" && date) {
        return date;
    }
    return "";
};
function getPhoneNumber(number) {
    return `tel:${number}`;
}
let billTotal = (bill) => {
    let result = bill.cart.reduce((accumulator, object) => {
        return accumulator + object.cost * object.count;
    }, 0)
    return result
}
onMounted(async () => {
    let result = []
    let data = await tripStore.getBoughtTrips()
    for (let bill of data) {
        let res = await tinkoffPlugin.checkPayment(bill.tinkoff.paymentId, bill.tinkoff.token)
        if (res.data.Status == "CONFIRMED") {
            bill.payment.amount = Number(res.data.Amount / 100)
        }
        result.push(bill)
    }
    bought.value = result.reverse()
})
</script>
<template>
    <a-row :gutter="[8, 8]">
        <a-col :lg="8" :sm="12" :xs="24" v-for="BILL of bought">
            <div>
                <a-card hoverable class="card">
                    <div class="d-flex space-between">
                        <div>
                            {{ BILL.tripId.name }}
                        </div>
                        <b>{{
                            clearData(BILL?.date)
                        }}</b>
                    </div>
                    <div style="color:#ff6600"><span v-if="BILL?.isWaitingList"> Лист ожидания</span></div>
                    <div> </div>
                    <div v-for="cartItem of BILL.cart">
                        <div v-if="cartItem.count">
                            {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.
                        </div>

                    </div>

                    <div class="d-flex justify-end">
                        <span>Итого: </span>
                        {{
                            billTotal(BILL)
                        }}
                        руб.

                    </div>
                    <div class="d-flex justify-end">
                        <span>Оплачено: </span>
                        {{
                            BILL.payment.amount
                        }}
                        руб.
                    </div>
                    <div v-for="doc in BILL.payment?.documents" class="d-flex justify-end">
                        {{ doc.payDocument }} -- {{ doc.paySum }} руб.
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <b>
                            <span v-if="billTotal(BILL) == BILL.payment.amount" style="color: #bcc662">
                                <span class="mdi mdi-check-all" style="font-size: 20px"></span>
                                оплачен
                            </span>
                            <span v-if="billTotal(BILL) != BILL.payment.amount" style="display: flex; align-items: center">
                                <div v-if="BILL.payment.amount == 0" style="color: #ff6600">
                                    <span class="mdi mdi-close" style="font-size: 20px; "></span>
                                    не оплачен
                                </div>
                                <div v-else style="color: #20A0CE">
                                    <span class="mdi mdi-check" style="font-size: 20px"></span>
                                    частично
                                </div>
                            </span>
                        </b>
                    </div>
                </a-card>
            </div>
        </a-col>
    </a-row>
</template>