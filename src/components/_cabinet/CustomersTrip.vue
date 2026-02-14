<script setup>
import { ref, onMounted, computed, getCurrentInstance, watch } from "vue";

import TinkoffLogo from '../../assets/images/tinkofflogo.svg'

import tinkoffPlugin from '../../plugins/tinkoff'

import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { useAuth } from "../../stores/auth";
import { useTrips } from "../../stores/trips";
import { useContract } from '../../stores/contract'
import PrintCustomers from '../../print/PrintCustomers.vue'
import Bus from "../Bus.vue";
import _ from 'lodash'
import { useBus } from "../../stores/bus";

const app = getCurrentInstance();
const htmlToPaper = app.appContext.config.globalProperties.$htmlToPaper;

const router = useRouter();
const route = useRoute();

const userStore = useAuth()
const tripStore = useTrips();
const contractStore = useContract()

let trip = ref({});
let userInfo = ref({
    fullname: '',
    phone: ''
})
let selectedStartLocation = ref();
let selectedByUser = ref([])
let additionalServices = ref([])

let addCustomerDialog = ref(false)
let setPaymentDialog = ref(false)
let addTouristsDialog = ref(false)
let editUserCommentDialog = ref(false)
// Refund (Tinkoff) modal state
let refundDialog = ref(false)
let refundMode = ref('full') // 'full' | 'partial'
let refundCart = ref([])
let refundServices = ref([])

let currentBill = ref(null)

let userComment = ref('')

let isSupervisor = ref(false);
let supervisor = ref({ cost: 0, count: 0, costType: 'руководитель' });

let sumOfPay = ref(0)
let documentNumber = ref('')
const print = async () => {
    await htmlToPaper('printMe');
};

let getSelectedUsersCount = computed(() => {
    let result = 0
    for (let cartItem of selectedByUser.value) {
        result += cartItem.count
    }
    return result
})


let tripStat = computed(() => {
    let statistic = {
        received: 0,
        amount: 0,
        totalCost: 0,
        additionalServicesSum: 0,
    }
    if (trip.value.billsList) {
        trip.value.billsList.forEach(element => {
            statistic.received = statistic.received + element.payment.amount
            if (element.additionalServices?.length > 0) {
                element.additionalServices.forEach((service) => {
                    statistic.additionalServicesSum += service.count * service.price
                    statistic.totalCost += service.count * service.price
                })
            }
            element.cart.forEach(cart => {
                statistic.amount += cart.count
                statistic.totalCost += cart.count * cart.cost
            })

        });
    }
    return statistic
})

// Количество уже занятых мест по каждому типу стоимости
const customersByCostType = computed(() => {
    const result = {}
    const bills = trip.value?.billsList ?? []
    for (const bill of bills) {
        const cart = bill?.cart ?? []
        for (const item of cart) {
            const type = item?.costType ?? 'Без типа'
            const count = Number(item?.count) || 0
            result[type] = (result[type] || 0) + count
        }
    }
    return result
})

let finalCost = computed(() => {
    let sum = 0;
    if (selectedByUser.value.length) {
        for (let c of selectedByUser.value) {
            sum += c.cost * c.count;
        }
    }
    for (let service of additionalServices.value) {
        sum += service.price * Number(service.count)
    }
    return sum;
});

let billTotal = (bill) => {
    let result = bill.cart.reduce((accumulator, object) => {
        return accumulator + object.cost * object.count;
    }, 0)
    for (let service of bill.additionalServices) {
        result += service.price * Number(service.count)
    }
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
    updateSeats()
    if (userInfo.value.phone) {
        let cart = [...selectedByUser.value, supervisor.value]
        let bill = {
            payment: {
                amount: isBoughtNow ? cart.reduce((accumulator, object) => {
                    return accumulator + object.cost *
                        object.count;
                }, 0) : 0
            },
            date: Date.now(),
            selectedStartLocation: selectedStartLocation.value,
            cart,
            additionalServices: additionalServices.value.filter((el) => el.count > 0),
            seats: selected_seats.value,
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
            .then((response) => {
                if (response.status !== 200) return
                updateTripInfo()
                message.config({ duration: 3, top: "90vh" });
                message.success({ content: "Тур заказан!" });
                addCustomerDialog.value = false;
                userInfo.value.fullname = ""
                userInfo.value.phone = ""
                for (let i of selectedByUser.value) {
                    i.count = 0
                }
                isSupervisor.value = false
                supervisor.value.count = 0
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
function showEditUserCommentDialog(bill) {
    editUserCommentDialog.value = true
    userComment.value = bill.userComment
    currentBill.value = bill
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
let loading = ref(false)
async function updateTripInfo() {
    let { data } = await tripStore.getFullTripById(route.query._id)

    for (let service of data.additionalServices) {
        additionalServices.value.push({ ...service, count: 0 })
    }

    for (let b of data.billsList) {
        if (b.tinkoff) {
              b.purchasedByTinkoff = true
            let res = await tinkoffPlugin.checkPayment(b.tinkoff.paymentId, b.tinkoff.token)
            if (res.data.Status == "CONFIRMED") {
                b.payment.amount = Number(res.data.Amount / 100)
                b.purchasedByTinkoff = true
            }
        }
    }
    trip.value = data;
}

async function editUserComment() {
    let response = await tripStore.editUserComment({ billId: currentBill.value._id, comment: userComment.value })
    if (response.status == 200) {
        editUserCommentDialog.value = false
        await updateTripInfo()
    }
}


let bus = ref()
let selected_seats = ref([])
let free_seats = ref([])
let show_old_bus = ref(true)

let peopleAmount = computed(() => selectedByUser.value.reduce((acc, cost) => acc + cost.count, 0) + supervisor.value.count)
let getCurrentCustomerNumber = computed(() => tripStat.value.amount + peopleAmount.value)

async function updateSeats() {
    if (!bus.value) return
    let bought_seats = await tripStore.getBoughtSeats(trip.value._id)
    free_seats.value = bus.value.seats.map(seat => seat.number).filter(seat => !bought_seats.includes(seat) && !bus.value.stuff.includes(seat))
    selected_seats.value = selected_seats.value.filter(seat => free_seats.value.includes(seat))
}

async function updateBus() {
    let transports = trip.value.transports.filter(bus => bus.capacity >= getCurrentCustomerNumber.value)
    transports = _.sortBy(transports, [o => o.capacity])
    let transport = transports[0]

    let bus_id = transport?.transportType.bus_id
    if (!bus_id) return show_old_bus.value = true
    show_old_bus.value = false

    bus.value = await useBus().getById(bus_id)
    updateSeats()
}

const getSellerContract = async (shopCode) => {
  
  return  await contractStore.getContractByShopCode(shopCode)

}

const printContract = async (BILL) => {
    tripStore.printContractTour ={}
    tripStore.printContractTour= BILL
    tripStore.printContractTour.billTotal= billTotal(BILL)
    tripStore.printContractTour.tripId = trip.value
    tripStore.printContractTour.seller =  await getSellerContract(String(trip.value.tinkoffContract.ShopCode))
    router.push('/print-contract')
   
};

watch(isSupervisor, (sup) => {
    if (sup == false) {
        supervisor.value.count = 0
    }
})


watch(peopleAmount, (newValue, oldValue) => {
    updateBus()
    updateSeats()
    if (getCurrentCustomerNumber.value > trip.value.maxPeople) {
        message.config({ duration: 3, top: "90vh" });
        message.success({ content: `Осталось всего ${trip.value.maxPeople - tripStat.value.amount} мест` });
    }

    selected_seats.value = []
})

onMounted(async () => {
    loading.value = true
    await updateTripInfo()

    for (let cost of trip.value.cost) {
        selectedByUser.value.push({
            cost: cost.price,
            count: 0,
            costType: cost.first,
        });
    }
    loading.value = false

});

// Computed refund total (rubles)
let refundTotal = computed(() => {
    if (!currentBill.value) return 0
    if (refundMode.value === 'full') return billTotal(currentBill.value)
    let total = 0
    for (const item of refundCart.value) {
        const count = Number(item.refundCount) || 0
        total += count * item.cost
    }
    for (const svc of refundServices.value) {
        const count = Number(svc.refundCount) || 0
        total += count * svc.price
    }
    return total
})

// Open refund dialog for a bill
function cancelPayment() {
    if (!currentBill.value || !currentBill.value.tinkoff) {
        message.error({ content: 'Нет данных Тинькофф для возврата' })
        return
    }
    refundMode.value = 'full'
    // Seed editable copies for partial refunds
    refundCart.value = (currentBill.value.cart || []).map(c => ({
        costType: c.costType,
        cost: c.cost,
        count: c.count,
        refundCount: 0,
    }))
    refundServices.value = (currentBill.value.additionalServices || []).map(s => ({
        name: s.name,
        price: s.price,
        count: Number(s.count) || 0,
        refundCount: 0,
    }))
    refundDialog.value = true
}

// Submit refund to Tinkoff
async function confirmCancelPayment() {
    if (!currentBill.value?.tinkoff?.paymentId) {
        message.error({ content: 'Не найден PaymentId' })
        return
    }

    // Проверяем наличие ShopCode
    const shopCode = trip.value.tinkoffContract?.ShopCode
    if (!shopCode) {
        message.error({ content: 'Не найден ShopCode для возврата' })
        return
    }

    try {
        let res
        if (refundMode.value === 'full') {
            // Полный возврат
            res = await tinkoffPlugin.cancelPayment(currentBill.value.tinkoff.paymentId)
        } else {
            // Частичный возврат: строим Receipt.Items и сумму в копейках
            const items = []
            const contractInfo = trip.value.tinkoffContract
            // Cart items
            for (const item of refundCart.value) {
                const qty = Number(item.refundCount) || 0
                if (qty > 0) {
                    items.push({
                        // Платформа Союз (агент)
                        AgentData: {
                            AgentSign: 'another',
                            OperationName: `"${item.costType}":${trip.value.name}`.slice(0, 24),
                            Phones: ['+79128523316'],
                            ReceiverPhones: ['+79128523316'],
                            OperatorName: 'Платформа Союз',
                            OperatorAddress: 'г.Глазов',
                            OperatorInn: '1837013960'
                        },
                        // Поставщик тура
                        SupplierInfo: {
                            Phones: contractInfo.Phones,
                            Name: contractInfo.Name,
                            Inn: contractInfo.Inn
                        },
                        Name: item.costType,
                        Price: item.cost * 100,
                        Quantity: qty,
                        Amount: item.cost * 100 * qty,
                        Tax: 'none',
                        PaymentMethod: 'full_payment',
                        PaymentObject: 'service',
                        ShopCode: String(shopCode),
                        MeasurementUnit: 'шт'
                    })
                }
            }
            // Additional services
            for (const svc of refundServices.value) {
                const qty = Number(svc.refundCount) || 0
                if (qty > 0) {
                    items.push({
                        // Платформа Союз (агент)
                        AgentData: {
                            AgentSign: 'another',
                            OperationName: `"${svc.name}":${trip.value.name}`.slice(0, 24),
                            Phones: ['+79128523316'],
                            ReceiverPhones: ['+79128523316'],
                            OperatorName: 'Платформа Союз',
                            OperatorAddress: 'г.Глазов',
                            OperatorInn: '1837013960'
                        },
                        // Поставщик тура
                        SupplierInfo: {
                            Phones: contractInfo.Phones,
                            Name: contractInfo.Name,
                            Inn: contractInfo.Inn
                        },
                        Name: svc.name,
                        Price: svc.price * 100,
                        Quantity: qty,
                        Amount: svc.price * 100 * qty,
                        Tax: 'none',
                        PaymentMethod: 'full_payment',
                        PaymentObject: 'service',
                        ShopCode: String(shopCode),
                        MeasurementUnit: 'шт'
                    })
                }
            }
            const amountKopecks = Math.round(refundTotal.value * 100)
            if (amountKopecks <= 0 || items.length === 0) {
                message.error({ content: 'Выберите позиции для частичного возврата' })
                return
            }
            res = await tinkoffPlugin.cancelPayment(
                currentBill.value.tinkoff.paymentId,
                amountKopecks,
                { Items: items, Taxation: 'usn_income', FfdVersion: '1.05' },
                trip.value.tinkoffContract
            )
        }

        if (res?.status === 200 && res.data?.Success) {
            message.success({ content: 'Возврат выполнен' })
            refundDialog.value = false
            await updateTripInfo()
        } else {
            const errText = res?.data?.Message || 'Ошибка выполнения возврата'
            message.error({ content: errText })
        }
    } catch (e) {
        console.error(e)
        message.error({ content: 'Не удалось выполнить возврат' })
    }
}
</script>

<template>
    <a-row>
        <a-col v-if="!loading" :span="24">
            <h3>Информация о туре</h3>
            <a-col :span="24" class="mb-8 d-flex space-between">
                <a-breadcrumb>
                    <a-breadcrumb-item @click="router.push('/cabinet/created-trips')">{{
                        trip.name
                        }}</a-breadcrumb-item>
                    <a-breadcrumb-item>Покупатели</a-breadcrumb-item>
                </a-breadcrumb>
                <a-button type="primary" class="lets_go_btn" @click="addCustomerDialog = true">
                    + Покупатель
                </a-button>
            </a-col>


            <a-row :gutter="[8, 8]">
                <a-col :lg="8" :sm="12" :xs="24">
                    
                    <a-card style=" border: 1px solid #245159; padding:4px">
                        Статистика тура
                        <div>c {{ clearData(trip.start) }} по {{ clearData(trip.end) }}</div>
                        <div>Максимум: {{ trip.maxPeople }} чел.</div>
                        <div>Забронировало: {{ tripStat ? tripStat.amount : '' }} чел.</div>
                        <div>Сумма полученная: {{ tripStat ? tripStat.received : '' }} руб.</div>
                        <div>Сумма доп. услуг {{ tripStat ? tripStat.additionalServicesSum : '' }} руб.</div>
                        <div>Сумма без доп. услуг {{ tripStat ? tripStat.totalCost - tripStat.additionalServicesSum : ''
                            }} руб.</div>
                        <div>Сумма полная: <b>{{ tripStat ? tripStat.totalCost : '' }} руб.</b></div>
                    </a-card>
                </a-col>

                <a-col :lg="8" :sm="12" :xs="24" v-for="(BILL, index) of trip.billsList">
                    <div>
                
                        <a-card hoverable class="card">
                            <div class="d-flex space-between">
                                <div style="color:#ff6600"><span v-if="BILL?.isWaitingList"> Лист ожидания</span></div>
                                <b>{{
                                    clearData(BILL?.date)
                                    }}</b>
                            </div>
                            <div>
                                <MdiIcon style="" name="account-outline" />
                                {{ BILL.userInfo.fullname }}

                            </div>
                            <div v-if="BILL.selectedStartLocation">
                                <MdiIcon style="" name="map-marker-outline" />
                                {{ BILL.selectedStartLocation }}
                            </div>
                            <div>
                                <MdiIcon style="" name="phone-outline" />
                                <a :href="getPhoneNumber(BILL.userInfo.phone)">
                                    {{ BILL.userInfo.phone }}</a>
                            </div>

                            <div v-for="cartItem of BILL.cart" class="d-flex justify-end">
                                <div v-if="cartItem.count">
                                    {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб. =
                                    {{ (cartItem.count * cartItem.cost).toFixed(2) }}
                                </div>

                            </div>
                            <div v-if="BILL.seats && BILL.seats.length" class="d-flex justify-end">
                                Места: {{ BILL.seats.join(', ') }}
                            </div>
                            <div class="d-flex justify-end" v-if="BILL.additionalServices?.length > 0">
                                {{ BILL.cart.reduce((acc, o) => { return acc + o.count * o.cost }, 0) }} руб.
                            </div>


                            <div v-if="BILL.additionalServices?.length > 0">
                                <hr>
                                <div v-for="service of BILL.additionalServices" class="d-flex justify-end">
                                    {{ service.name }} {{ service.count }} x {{ service.price }} руб. =

                                    {{ BILL.additionalServices.reduce((acc, o) => { return acc + o.count * o.price }, 0)
                                    }} руб.
                                </div>
                                <hr>
                            </div>

                            <div class="d-flex justify-end">
                                <span>Итого: </span>&nbsp;
                                <b>
                                    {{ billTotal(BILL) }} руб.
                                </b>
                            </div>
                            <div class="d-flex justify-end">
                                <span>Оплачено: </span>&nbsp;
                                {{ BILL.payment.amount }} руб.
                            </div>
                            <div v-for="doc in BILL.payment?.documents" class="d-flex justify-end">
                                {{ doc.payDocument }} -- {{ doc.paySum }} руб.
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <div style="font-size: 20px">
                                    <!-- <span @click="() => { setPaymentDialog = true; currentBill = BILL }"
                                        v-if="billTotal(BILL) > BILL.payment.amount" class="mdi mdi-cart-plus"
                                        style="color: #245159; cursor: pointer; margin-right:8px"></span> -->
                                        <MdiIcon name="cart-plus" @click="() => { setPaymentDialog = true; currentBill = BILL }"
                                        v-if="billTotal(BILL) > BILL.payment.amount"
                                        style="color: #245159; cursor: pointer; margin-right:8px" />
                                    <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                                        @confirm="deletePayment(BILL)">
                                        <MdiIcon style="color: #ff6600; cursor: pointer" name="delete" />
                                    </a-popconfirm>
                                    <MdiIcon @click="showAddTouristsDialog(BILL)" name="account-plus-outline" class="ml-4" />
                                    <a-badge :dot="true" v-if="BILL.userComment?.length > 0">
                                        <MdiIcon @click="showEditUserCommentDialog(BILL)" name="comment-edit-outline" size="18px" class="ml-4" />
                                    </a-badge>
                                    <MdiIcon v-else
                                        @click="showEditUserCommentDialog(BILL)" name="comment-edit-outline" size="18px" class="ml-4" />

                                    <MdiIcon style=" cursor: pointer" @click="printContract(BILL)" name="printer-outline" class="ml-4" />

                                </div>

                                <b v-if="BILL.purchasedByTinkoff">
                                    <div> <img :src="TinkoffLogo" alt="tinkoff" class="tinkoff-logo"></div>
                                    <a-button @click="() => { currentBill = BILL; cancelPayment() }">Возврат</a-button>
                                </b>
                                <b v-else>
                                    <span v-if="billTotal(BILL) == BILL.payment.amount" style="color: #bcc662">
                                        <MdiIcon name="check-all" size="20px" />
                                        оплачен
                                    </span>
                                    <span v-if="billTotal(BILL) != BILL.payment.amount"
                                        style="display: flex; align-items: center">
                                        <div v-if="BILL.payment.amount == 0" style="color: #ff6600">
                                            <MdiIcon name="close" size="20px" />
                                            не оплачен
                                        </div>
                                        <div v-else style="color: #20A0CE">
                                            <MdiIcon style="font-size: 20px" name="check" />
                                            частично
                                        </div>
                                    </span>
                                </b>
                            </div>
                        </a-card>
                    </div>
                </a-col>
            </a-row>

            <div id="printMe" style="display: none">
                <PrintCustomers :customers="trip.billsList" :trip="trip" :total='tripStat' />
            </div>
            <div class="d-flex justify-center">
                <a-button @click="print()" type="primary" class="lets_go_btn ma-8">
                    <MdiIcon name="printer-outline" class="mr-4" /> Печать
                </a-button>
            </div>
        </a-col>
        <a-col v-else :span="24" class="d-flex justify-center">
            <img src="../../assets/images/founddog.webp" alt="not found" style="height: 150px; margin-top: 50px;">
        </a-col>



        <!-- ALL MODALS -->

        <a-modal v-model:open="editUserCommentDialog" :footer="null" title="Изменить комментарий">
            <div>
                <MdiIcon style="" name="account-outline" />
                {{ currentBill.userInfo.fullname }}

            </div>
            <div v-if="currentBill.selectedStartLocation">
                <MdiIcon style="" name="map-marker-outline" />
                {{ currentBill.selectedStartLocation }}
            </div>
            <div>
                <MdiIcon style="" name="phone-outline" />
                <a :href="getPhoneNumber(currentBill.userInfo.phone)">
                    {{ currentBill.userInfo.phone }}</a>
            </div>
            <div v-for="cartItem of currentBill.cart">
                <div v-if="cartItem.count">
                    {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.
                </div>

            </div>

            <div class="d-flex justify-end">
                <span>Итого: </span>
                {{
                    billTotal(currentBill)
                }}
                руб.

            </div>
            <div class="d-flex justify-end">
                <span>Оплачено: </span>
                {{
                    currentBill.payment.amount
                }}
                руб.
            </div>
            <a-textarea v-model:value="userComment" placeholder="Комментарий к чеку" class="mt-12 mb-12" />

            <a-col :span="24" class="d-flex justify-center mt-8">
                <a-button @click="editUserCommentDialog = false">отмена</a-button>
                <a-button type="primary" class="lets_go_btn ml-8" @click="editUserComment">отправить</a-button>
            </a-col>
        </a-modal>
        <a-modal v-model:open="addTouristsDialog" :footer="null" title="Добавить туристов">
            <a-row :gutter="[0, 8]">
                <a-col :span="12">
                    Имя
                </a-col>
                <a-col :span="12">
                    Телефон
                </a-col>
                <a-col :span="24" v-for="tourist, index of currentBill.touristsList">
                    <a-row :gutter="[8, 8]">
                        <a-col :span="12">
                            <a-input style="width: 100%" v-model:value="tourist.fullname"
                                placeholder="Иванов Иван Иванович" />
                        </a-col>
                        <a-col :span="12" class="d-flex">
                            <a-input style="width: 100%" v-model:value="tourist.phone" placeholder="89127528877" />
                            <MdiIcon style="font-size: 20px; color: #ff6600 "
                                @click="currentBill.touristsList.splice(index, 1)" name="close" />
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :span="24">
                    <a-button type="dashed" block @click="currentBill.touristsList.push({ fullname: '', phone: '' })"
                        :disabled="currentBill.cart.reduce((accumulator, object) => {
                            return accumulator + object.count;
                        }, 0) == currentBill.touristsList.length">+
                        добавить</a-button>
                </a-col>
                <!-- <a-col :span="24">
                    <a-button type="dashed" style="color: red" block @click="currentBill.touristsList.pop()">
                        удалить</a-button>
                </a-col> -->
                <a-col :span="24" class="d-flex justify-center mt-8">
                    <a-button @click="addTouristsDialog = false">отмена</a-button>
                    <a-button type="primary" class="lets_go_btn ml-8"
                        @click="updateTourists(currentBill)">отправить</a-button>
                </a-col>
            </a-row>
        </a-modal>
        <!-- Refund (Tinkoff) modal -->
        <a-modal v-model:open="refundDialog" :footer="null" title="Возврат по Тинькофф">
            <a-row :gutter="[8,8]">
                <a-col :span="24">
                    <div>
                        <MdiIcon name="account-outline" />
                        {{ currentBill?.userInfo?.fullname }}
                    </div>
                    <div v-if="currentBill?.selectedStartLocation">
                        <MdiIcon name="map-marker-outline" />
                        {{ currentBill.selectedStartLocation }}
                    </div>
                    <div>
                        <MdiIcon name="phone-outline" />
                        <a :href="getPhoneNumber(currentBill?.userInfo?.phone)">{{ currentBill?.userInfo?.phone }}</a>
                    </div>
                </a-col>

                <a-col :span="24" class="mt-8">
                    <a-radio-group v-model:value="refundMode">
                        <a-radio value="full">Полный возврат</a-radio>
                        <a-radio value="partial">Частичный возврат</a-radio>
                    </a-radio-group>
                </a-col>

                <a-col v-if="refundMode==='partial'" :span="24" class="mt-8">
                    <div>Товары корзины</div>
                    <div v-for="(item, idx) in refundCart" :key="'rc'+idx" class="d-flex space-between align-center">
                        <span>{{ item.costType }} — {{ item.count }} шт. × {{ item.cost }} руб.</span>
                        <div class="d-flex direction-column">
                            <span style="font-size: 8px">к возврату</span>
                            <a-input-number v-model:value="item.refundCount" :min="0" :max="item.count" />
                        </div>
                    </div>
                    <div v-if="refundServices.length" class="mt-8">Доп. услуги</div>
                    <div v-for="(svc, sidx) in refundServices" :key="'rs'+sidx" class="d-flex space-between align-center">
                        <span>{{ svc.name }} — {{ svc.count }} шт. × {{ svc.price }} руб.</span>
                        <div class="d-flex direction-column">
                            <span style="font-size: 8px">к возврату</span>
                            <a-input-number v-model:value="svc.refundCount" :min="0" :max="svc.count" />
                        </div>
                    </div>
                </a-col>

                <a-col :span="24" class="d-flex justify-end mt-12">
                    <span>К возврату: </span>&nbsp;<b>{{ refundTotal }} руб.</b>
                </a-col>

                <a-col :span="24" class="d-flex justify-center mt-8">
                    <a-button @click="refundDialog=false">отмена</a-button>
                    <a-button type="primary" class="lets_go_btn ml-8" @click="confirmCancelPayment">подтвердить</a-button>
                </a-col>
            </a-row>
        </a-modal>
        <a-modal v-model:open="setPaymentDialog" :footer="null" title="Поставить оплату">
            <a-row :gutter="[16, 16]">
                <a-col :span="24">
                    <div>К оплате: {{ billTotal(currentBill) }} руб.</div>
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
                            <div >
                                <span style="font-size: 8px">кол-во</span>
                                <span style="font-size: 8px" v-if="cost.limit">
                                    ( {{ customersByCostType[cost.first] || 0 }} / {{ cost.limit }} )
                                </span>
                            </div>
                            <a-input-number
                                v-model:value="selectedByUser[index].count"
                                :min="0"
                                :disabled="cost.limit && (customersByCostType[cost.first] || 0) >= cost.limit"
                                :max="cost.limit ? Math.max(0, cost.limit - (customersByCostType[cost.first] || 0)) : (trip.maxPeople - tripStat.amount)"
                                placeholder="чел"
                            />
                        </div>
                    </div>
                    <div v-if='isSupervisor' class="d-flex space-between align-center">
                        руководитель<span>0 руб. </span>
                        <div class="d-flex direction-column">
                            <span style="font-size: 8px">кол-во</span>
                            <a-input-number v-model:value="supervisor.count" :min="0"
                                :max="trip.maxPeople - tripStat.amount" placeholder="чел"></a-input-number>
                        </div>
                    </div>
                    <a-checkbox v-model:checked="isSupervisor">Руководитель</a-checkbox>
                </a-col>
                <a-col v-if="trip.additionalServices?.length > 0" :span="24">
                    <div>Дополнительные услуги</div>
                    <a-row v-for="service of additionalServices" class="d-flex space-between">
                        <div class="d-flex align-center">
                            {{ service.name }}
                        </div>
                        <div class="d-flex align-center">
                            {{ service.price }} руб.
                        </div>
                        <div class="d-flex direction-column">
                            <span style="font-size: 8px;">кол-во</span>
                            <a-input-number v-model:value="service.count" :min="0" :max="getSelectedUsersCount"
                                placeholder="чел"></a-input-number>
                            <!-- <a-checkbox v-model:checked="service.selected" class="ma-8">добавить</a-checkbox> -->
                        </div>
                    </a-row>
                </a-col>
                <a-col :span="24">
                    <b>Итого: {{ finalCost }} руб.</b>
                </a-col>

                <a-col v-if="bus && peopleAmount > 0" :span="24" class="mb-8">
                    <div>Выберите места</div>
                    <div style="font-size:0.8em; opacity: 0.8;">{{ bus.name }}</div>
                    <Bus @select="updateSeats" v-model:selected_seats="selected_seats" :free_seats="free_seats"
                        :max_count="peopleAmount" :bus="bus" style="width: 150px;" />
                </a-col>

                <a-col :span="24">
                    <div>Создать счет</div>
                    <div class="d-flex space-around">
                        <!-- <a-button type="primary" @click="buyTrip(true)"> сейчас </a-button> -->
                        <a-button @click="buyTrip(false)" type="primary"> создать </a-button>
                    </div>
                </a-col>
            </a-row>
        </a-modal>
    </a-row>
</template>
<style scoped lang="scss">
.tinkoff-logo {
    height: 20px;
    width: 90px;
}
</style>
