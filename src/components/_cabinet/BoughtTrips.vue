<script setup>
import TinkoffLogo from '../../assets/images/tinkofflogo.svg'
import tinkoffPlugin from '../../plugins/tinkoff';
import { onMounted, ref } from 'vue';
import { useTrips } from '../../stores/trips'
import { useAuth } from '../../stores/auth'


const tripStore = useTrips()
const userStore = useAuth()

// все чеки
let bought = ref([])
// индикатор загрузки
let loading = ref(false)
// диалоговое окно
let buyDialog = ref(false)
// оплатить -> выводится инфа по этому чеку
let currentBill = ref({})


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
let billTotal = (bill) => {
    let result = bill.cart.reduce((accumulator, object) => {
        return accumulator + object.cost * object.count;
    }, 0)
    for (let service of bill.additionalServices) {
        result += service.count * service.price
    }
    return result
}

async function updateBought() {
    loading.value = true
    let result = []
    let data = await tripStore.getBoughtTrips()
    for (let bill of data) {
        if (bill.tinkoff) {
            let res = await tinkoffPlugin.checkPayment(bill.tinkoff.paymentId, bill.tinkoff.token)
            if (res.data.Status == "CONFIRMED") {
                bill.payment.amount = Number(res.data.Amount / 100)
            }
        }
        result.push(bill)
    }
    bought.value = result.reverse()
    loading.value = false
}

async function cancelTrip(bill_id, user_id) {
    let res = await userStore.cancelTrip(bill_id, user_id)
    if (res.status == 200)
        await updateBought()
}
async function buyTrip(cardId) {
    for (let b of bought.value) {
        if (b._id == cardId) {
            currentBill.value = b
            break
        }
    }
    // console.log(currentBill.value);
    buyDialog.value = true
    const orderId = Date.now().toString()
    let { data, token, success } =
        await tinkoffPlugin.initPayment(orderId, currentBill.value.cart, userStore.user.email, currentBill.value.tripId.tinkoffContract, currentBill.value.tripId.name)
    if (!success) {
        message.config({ duration: 3, top: "90vh" });
        message.error({ content: "Ошибка при оплате" });
        return
    }
    currentBill.value.tinkoff =
    {
        orderId: data.OrderId,
        amount: data.Amount,
        token,
        paymentId: data.PaymentId
    }

    window.open(data.PaymentURL, '_blank')

    userStore
        .payTinkoffBill(currentBill.value, currentBill.value.tinkoff, currentBill.value.tripId.name, currentBill.value.tripId.author.email)
        .then(async (response) => {
            if (response.status == 200) {
                message.config({ duration: 3, top: "90vh" });
                message.success({ content: "Тур заказан!" });
            }
            buyDialog.value = false;
        })
        .catch((err) => {
            console.log(err);
        });
}
onMounted(async () => {
    await updateBought()
})
</script>
<template>
    <a-row v-if="loading">
        <a-col :span="24" class="d-flex justify-center mt-16">
            <img src="../../assets/images/founddog.webp" alt="" style="height: 150px;">
        </a-col>
    </a-row>
    <a-row v-else :gutter="[8, 8]">
        <a-col :lg="8" :sm="12" :xs="24" v-for="BILL of bought">
            <div>
                <a-card hoverable class="card">
                    <div class="d-flex space-between">
                        <div>
                            {{ BILL.tripId?.name }}
                        </div>
                        <b>{{ clearData(BILL?.date) }}</b>
                    </div>
                    <div style="color:#ff6600"><span v-if="BILL?.isWaitingList"> Лист ожидания</span></div>
                    <div> </div>
                    <div v-for="cartItem of BILL.cart">
                        <div v-if="cartItem.count">
                            {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.
                        </div>
                    </div>

                    <div v-if="BILL.seats && BILL.seats.length">
                        Места: {{ BILL.seats.join(', ') }}
                    </div>
                    <div class="d-flex justify-end" v-if="BILL.additionalServices?.length > 0">
                        {{ BILL.cart.reduce((acc, o) => { return acc + o.count * o.cost }, 0) }} руб.
                    </div>
                    <a-button v-if="BILL.additionalServices?.length > 0 && BILL.showAdditionalServices == undefined" type="dashed" style="text-transform: none;"
                        block size="x-small" @click="BILL.showAdditionalServices = true">доп. услуги {{ BILL.additionalServices.reduce((acc, o) => { return acc + o.count * o.price }, 0) }} руб.</a-button>
                    <div v-if="BILL.additionalServices?.length > 0 && BILL.showAdditionalServices">
                        <hr>
                        <div v-for="service of BILL.additionalServices">
                            {{ service.name }} {{ service.count }} x {{ service.price }} руб.
                        </div>
                        <div class="d-flex justify-end">
                            {{ BILL.additionalServices.reduce((acc, o) => { return acc + o.count * o.price }, 0) }} руб.
                        </div>
                        <hr>
                    </div>
                    <div class="d-flex justify-end">
                        <span>Итого: </span>&nbsp;
                        <b>
                            {{ billTotal(BILL) }}
                            руб.
                        </b>

                    </div>
                    <div class="d-flex justify-end">
                        <span>Оплачено: </span>&nbsp;
                        {{ BILL.payment.amount }}
                        руб.
                    </div>
                    <div v-for="doc in BILL.payment?.documents" class="d-flex justify-end">
                        {{ doc.payDocument }} -- {{ doc.paySum }} руб.
                    </div>
                    <div style="display: flex; align-items: start; justify-content: space-between;">
                        <span v-if="billTotal(BILL) == BILL.payment.amount" style="color: #bcc662">
                            <span class="mdi mdi-check-all" style="font-size: 20px"></span>
                            оплачен
                        </span>
                        <span v-if="billTotal(BILL) != BILL.payment.amount && BILL.payment.amount == 0"
                            style="display: flex; align-items: center">
                            <div class="buy-btn">
                                <div>
                                    <a-button @click="buyTrip(BILL._id)" type="primary" class="lets_go_btn">
                                        оплатить
                                    </a-button>
                                </div>
                                <div class="d-flex justify-center">
                                    <img :src="TinkoffLogo" class="tinkoff-logo">
                                </div>
                            </div>
                        </span>
                        <a-popconfirm v-if="BILL.payment.amount == 0" title="Отказаться?" ok-text="Да" cancel-text="Нет"
                            @confirm="cancelTrip(BILL._id, userStore.user._id)">
                            <span class="mdi mdi-24px mdi-delete ml-16" style="color: #ff6600"></span>
                        </a-popconfirm>
                    </div>

                </a-card>
            </div>

        </a-col>
    </a-row>
    <!-- <a-modal v-model:open="buyDialog" :footer="null">
        <form @submit.prevent="buyTrip" class="mt-16">
            <a-row :gutter="[4, 8]">
                <a-col :span="24">
                    <div class="d-flex direction-column">
                        Место посадки:<b>
                            {{ currentBill.selectedStartLocation }}
                        </b>
                    </div>
                </a-col>
                <a-col :span="24">
                    <div>Даты: <b>
                            {{ clearData(currentBill.tripId.start) + " - " + clearData(currentBill.tripId.start) }}
                        </b>
                    </div>
                </a-col>
                <a-col :span="24">
                    <div>Цены:</div>
                    <div v-if="currentBill.isWaitingList" style="color: #ff6600">
                        Вы в листе ожидания
                    </div>
                    <a-row v-for="cost of currentBill.cart">
                        <a-col :span="8">
                            {{ cost.costType }}
                        </a-col>

                        <a-col :span="8">{{ cost.cost }} руб.</a-col>
                        <a-col :span="8" class="d-flex justify-end">
                            {{ cost.count }} чел.
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :span="24" class="d-flex justify-end">
                    <b>Итого: {{ billTotal(currentBill) }} руб.</b>
                </a-col>
                <div v-if="currentBill.tripId?.partner">
                    <h4 class="warning">Наличие мест требует уточнения!</h4>
                </div>

                <a-col :span="24">
                    <div class="d-flex space-around">
                        <div class="buy-btn">
                            <div>
                                <a-button html-type="submit" type="primary" class="lets_go_btn">
                                    оплатить
                                </a-button>
                            </div>
                            <div class="d-flex justify-center">
                                <img :src="TinkoffLogo" class="tinkoff-logo">
                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </Form>
    </a-modal> -->
</template>
<style lang="scss" scoped>
.buy-btn {
    display: flex;
    flex-direction: column;

    .tinkoff-logo {
        height: 20px;
        width: 90px;
    }

    img {
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -o-user-select: none;
        user-select: none;
    }
}
</style>