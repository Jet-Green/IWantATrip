<script setup>
import { ref, onMounted, computed, getCurrentInstance } from "vue";

import tinkoffPlugin from '../../plugins/tinkoff'

import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useAuth } from "../../stores/auth";
import { useTrips } from "../../stores/trips";
import PrintCustomers from '../../print/PrintCustomers.vue'

const app = getCurrentInstance();
const htmlToPaper = app.appContext.config.globalProperties.$htmlToPaper;

const router = useRouter();
const route = useRoute();

const userStore = useAuth()
const tripStore = useTrips();


let trip = ref({});
let userInfo = ref({
    fullname: '',
    phone: ''
})
let selectedStartLocation = ref();
let selectedByUser = ref([])

let addCustomerDialog = ref(false)

let setPaymentDialog = ref(false)

let addTouristsDialog = ref(false)

let currentBill = ref(null)

let sumOfPay = ref(0)
let documentNumber = ref('')
const print = async () => {
    await htmlToPaper('printMe');
};




let tripStat = computed(() => {
    let statistic = {
        received: 0,
        amount: 0,
        totalCost: 0,
    }
    if (trip.value.billsList) {
        trip.value.billsList.forEach(element => {
            statistic.received = statistic.received + element.payment.amount
            element.cart.forEach(cart => {
                statistic.amount = statistic.amount + cart.count
                statistic.totalCost = statistic.totalCost + cart.count * cart.cost
            })

        });
        return statistic
    }
})

let finalCost = computed(() => {
    let sum = 0;
    if (selectedByUser.value.length) {
        for (let c of selectedByUser.value) {
            sum += c.cost * c.count;
        }
    }
    return sum;
});

let billTotal = (bill) => {
    let result = bill.cart.reduce((accumulator, object) => {
        return accumulator + object.cost * object.count;
    }, 0)
    return result
}

async function setPayment() {
    currentBill.value.payment.amount = sumOfPay.value
    let doc = {}
    doc.paySum = sumOfPay.value
    doc.payDocument = documentNumber.value
    let res = await tripStore.setPayment({ bill: currentBill.value, doc: doc })

    if (res.status == 200) {
        setPaymentDialog.value = false
        await updateTripInfo()
        sumOfPay.value = 0
        documentNumber.value = ''
    }
}
async function deletePayment(bill) {
    let res = await tripStore.deletePayment(bill._id)
    if (res.status == 200) {
        for (let i = 0; i < trip.value.billsList.length; i++) {
            if (trip.value.billsList[i]._id == bill._id) {
                trip.value.billsList.splice(i, 1);
            }
        }
    }
}
async function buyTrip(isBoughtNow) {
    if (userInfo.value.phone) {
        let cart = [...selectedByUser.value]
        let bill = {
            payment: {
                amount: isBoughtNow ? cart.reduce((accumulator, object) => {
                    return accumulator + object.cost *
                        object.count;
                }, 0) : 0
            },
            selectedStartLocation: selectedStartLocation.value,
            cart,
            tripId: trip.value._id,
            userInfo: {
                _id: null,
                fullname: userInfo.value.fullname,
                phone: userInfo.value.phone,
            },
            touristsList: [{
                fullname: userInfo.value.fullname,
                _id: null,
                phone: userInfo.value.phone
            }]
        };

        for (let i = 0; i < bill.cart.length; i++) {
            if (bill.cart[i].count == 0) {
                bill.cart.splice(i, 1);
            }
        }

        await userStore
            .buyTrip(trip.value._id, bill)
            .then(() => {
                updateTripInfo()
                message.config({ duration: 3, top: "90vh" });
                message.success({ content: "Тур заказан!" });
                addCustomerDialog.value = false;
                userInfo.value.fullname = ""
                userInfo.value.phone = ""
                for (let i of selectedByUser.value) {
                    i.count = 0
                }
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        message.config({ duration: 3, top: "90vh" });
        message.error({ content: "Нужен телефон" });
    }
}

async function updateTourists(bill) {
    for (let i = 0; i < bill.touristsList.length; i++) {
        let t = bill.touristsList[i]

        t.fullname = t.fullname.trim()
        t.phone = t.phone.trim()

        if (!t.fullname || !t.phone) {
            bill.touristsList.splice(i, 1)
        }
    }

    let res = await tripStore.updateTourists(bill)
    if (res.status == 200) {
        addTouristsDialog.value = false
    }
}

let showAddTouristsDialog = (bill) => {
    currentBill.value = bill
    !currentBill.value.touristsList.length ?
        currentBill.value.touristsList.push(currentBill.value.userInfo)
        : null
    addTouristsDialog.value = true;
}

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

async function updateTripInfo() {
    let { data } = await tripStore.getFullTripById(route.query._id)
    for (let b of data.billsList) {
        if (b.tinkoff) {
            let res = await tinkoffPlugin.checkPayment(b.tinkoff.paymentId, b.tinkoff.token)
            if (res.data.Status == "CONFIRMED") {
                b.payment.amount = Number(res.data.Amount / 100)
            }
        }
    }
    trip.value = data;
}
onMounted(async () => {
    await updateTripInfo()
    for (let cost of trip.value.cost) {
        selectedByUser.value.push({
            cost: cost.price,
            count: 0,
            costType: cost.first,
        });
    }

});
</script>

<template>
    <h3>Информация о туре</h3>
    <a-col :span="24" class="mb-8 d-flex space-between">
        <a-breadcrumb>
            <a-breadcrumb-item @click="router.push('/cabinet/created-trips')">{{
                trip.name
            }}</a-breadcrumb-item>
            <a-breadcrumb-item>Покупатели</a-breadcrumb-item>
        </a-breadcrumb>
        <a-button class="lets_go_btn" @click="addCustomerDialog = true">
            + Покупатель
        </a-button>
    </a-col>


    <a-row :gutter="[8, 8]">
        <a-col :lg="8" :sm="12" :xs="24">
            <div class="mb-8">

            </div>
            <a-card style=" border: 1px solid #245159; padding:4px">
                Статистика тура
                <div>c {{ clearData(trip.start) }} по {{ clearData(trip.end) }}</div>
                <div>Максимум: {{ trip.maxPeople }} чел.</div>
                <div>Забронировало: {{ tripStat ? tripStat.amount : '' }} чел.</div>
                <div>Сумма полученная: {{ tripStat ? tripStat.received : '' }} руб.</div>
                <div>Сумма полная: {{ tripStat ? tripStat.totalCost : '' }} руб.</div>
            </a-card>
        </a-col>
        <a-col :lg="8" :sm="12" :xs="24" v-for="(BILL, index) of trip.billsList">
            <div>
                <a-card hoverable class="card">
                    <div>
                        <span class="mdi mdi-account-outline" style=""></span>
                        {{ BILL.userInfo.fullname }}
                    </div>
                    <div v-if="BILL.selectedStartLocation">
                        <span class="mdi mdi-map-marker-outline" style=""></span>
                        {{ BILL.selectedStartLocation }}
                    </div>
                    <div>
                        <span class="mdi mdi-phone-outline" style=""></span>
                        <a :href="getPhoneNumber(BILL.userInfo.phone)">
                            {{ BILL.userInfo.phone }}</a>
                    </div>
                    <div v-for="cartItem of BILL.cart">
                        {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.
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
                    <div v-for="doc in BILL.payment?.documents  " class="d-flex justify-end">
                        {{ doc.payDocument }} -- {{ doc.paySum }} руб.
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <div style="font-size: 20px">
                            <span @click="() => { setPaymentDialog = true; currentBill = BILL }"
                                v-if="billTotal(BILL) > BILL.payment.amount" class="mdi mdi-cart-plus"
                                style="color: #245159; cursor: pointer; margin-right:8px"></span>
                            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="deletePayment(BILL)">
                                <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
                            </a-popconfirm>
                            <span class="mdi mdi-account-plus-outline ml-4" @click="showAddTouristsDialog(BILL)"></span>
                        </div>

                        <b>
                            <span v-if="BILL.cart.reduce((accumulator, object) => {
                                return accumulator + object.cost *
                                    object.count;
                            }, 0) == BILL.payment.amount" style="color: #bcc662">
                                <span class="mdi mdi-check-all" style="font-size: 20px"></span>
                                оплачен

                            </span>
                            <span v-else style="display: flex; align-items: center">
                                <span class="mdi mdi-close" style="font-size: 20px"></span>
                                не оплачен
                            </span>
                        </b>

                    </div>
                </a-card>
            </div>
        </a-col>
    </a-row>
    <a-modal v-model:open="addTouristsDialog" :footer="null" title="Добавить туристов">
        <a-row :gutter="[0, 8]">
            <a-col :span="12">
                Имя
            </a-col>
            <a-col :span="12">
                Телефон
            </a-col>
            <a-col :span="24" v-for="tourist of currentBill.touristsList">
                <a-row :gutter="[8, 8]">
                    <a-col :span="12">
                        <a-input style="width: 100%" v-model:value="tourist.fullname" placeholder="Иванов Иван Иванович" />
                    </a-col>
                    <a-col :span="12">
                        <a-input style="width: 100%" v-model:value="tourist.phone" placeholder="89127528877" />
                    </a-col>
                </a-row>
            </a-col>
            <a-col :span="24">
                <a-button type="dashed" block @click="currentBill.touristsList.push({ fullname: '', phone: '' })" :disabled="currentBill.cart.reduce((accumulator, object) => {
                    return accumulator + object.count;
                }, 0) == currentBill.touristsList.length">+
                    добавить</a-button>
            </a-col>
            <a-col :span="24">
                <a-button type="dashed" style="color: red" block @click="currentBill.touristsList.pop()">
                    удалить</a-button>
            </a-col>
            <a-col :span="24" class="d-flex justify-center mt-8">
                <a-button @click="addTouristsDialog = false">отмена</a-button>
                <a-button type="primary" class="lets_go_btn ml-8" @click="updateTourists(currentBill)">отправить</a-button>
            </a-col>
        </a-row>
    </a-modal>
    <a-modal v-model:open="setPaymentDialog" :footer="null" title="Поставить оплату">
        <a-row :gutter="[16, 16]">
            <a-col :span="24">
                <div>К отплате: {{ billTotal(currentBill) }} руб.</div>
                <div>Оплачено: {{ currentBill.payment.amount }} руб.</div>
                <div>Оплатить: {{ billTotal(currentBill) - currentBill.payment.amount }} руб.</div>
                <a-row :gutter="[4, 4]">
                    <a-col cols="6">
                        <a-input-number style="width: 100%" placeholder="8900" v-model:value="sumOfPay"
                            :max="billTotal(currentBill) - currentBill.payment.amount" />
                    </a-col>
                    <a-col cols="6">
                        <a-input style="width: 100%" v-model:value="documentNumber" placeholder="документ" />
                    </a-col>
                </a-row>


            </a-col>
            <a-col :span="24">
                <a-button @click="setPayment()" type="primary" class="lets_go_btn">оплатить</a-button>
            </a-col>
        </a-row>
    </a-modal>
    <a-modal v-model:open="addCustomerDialog" :footer="null" title="Добавить покупателя">
        <a-row :gutter="[4, 4]">
            <a-col :span="24" :md="12">
                Фaмилия Имя
                <a-input style="width: 100%" v-model:value="userInfo.fullname" placeholder="Иванов Иван Иванович" />
            </a-col>
            <a-col :span="24" :md="12">
                Телефон
                <a-input style="width: 100%" v-model:value="userInfo.phone" placeholder="79127528874" />
            </a-col>

            <a-col :span="24">
                <div class="d-flex direction-column">
                    Место посадки
                    <a-select placeholder="г.Глазов" v-model:value="selectedStartLocation" style="width: ">
                        <a-select-option v-for="item in trip.locationNames" :value="item.name"></a-select-option>
                    </a-select>
                </div>
            </a-col>

            <a-col :span="24">
                <div>Цена</div>
                <div class="d-flex space-between align-center" v-for="(cost, index) of trip.cost" :key="index">
                    {{ cost.first }}<span>{{ cost.price }} руб. </span>
                    <div class="d-flex direction-column">
                        <span style="font-size: 8px">кол-во</span>

                        <a-input-number v-model:value="selectedByUser[index].count" :min="0"
                            :max="trip.maxPeople - tripStat.amount" placeholder="чел"></a-input-number>
                    </div>
                </div>
            </a-col>
            <a-col :span="24">
                <b>Итого: {{ finalCost }} руб.</b>
            </a-col>

            <a-col :span="24">
                <div>Оплатить</div>
                <div class="d-flex space-around">
                    <a-button type="primary" @click="buyTrip(true)"> сейчас </a-button>
                    <a-button @click="buyTrip(false)"> потом </a-button>
                </div>
            </a-col>
        </a-row>
    </a-modal>
    <div id="printMe" style="display: none">
        <PrintCustomers :customers="trip.billsList" :trip="trip" :total='tripStat' />
    </div>
    <div class="d-flex justify-center">
        <a-button @click="print()" type="primary" class="lets_go_btn ma-8">
            <span class="mdi mdi-printer-outline mr-4"></span> Печать
        </a-button>
    </div>
</template>

<style scoped></style>
