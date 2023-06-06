<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

import { message } from "ant-design-vue";

import { useAuth } from "../../stores/auth";
import { useTrips } from "../../stores/trips";

const router = useRouter();
const route = useRoute();

const userStore = useAuth()
const tripStore = useTrips();

let customers = ref([]);
const allBooks = ref({});
const payedBooks = ref({});
const pricesSet = new Set();
const _id = route.query.id;
let trip = ref({});
let userInfo = ref({
    fullname: '',
    phone: ''
})
let selectedByUser = ref([])

let addCustomerDialog = ref(false)

let tripsCount = computed(() => {
    let sum = 0;
    for (let i = 0; i < trip.value.billsList.length; i++) {
        if (trip.value.billsList[i]) {
            for (let j = 0; j < trip.value.billsList[i].cart?.length; j++) {
                sum += trip.value.billsList[i].cart[j].count;
            }
        }
    }
    return sum;
});
let finalCost = computed(() => {
    let sum = 0;
    if (selectedByUser.value.length) {
        for (let c of selectedByUser.value) {
            sum += c.cost * c.count;
        }
    }
    return sum;
});
async function setPayment(bill) {
    let res = await tripStore.setPayment(bill._id)
    if (res.status == 200) {
        for (let b of trip.value.billsList) {
            if (b._id == bill._id) {
                b.isBoughtNow = true;
            }
        }
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
        let bill = {
            isBoughtNow,
            cart: [...selectedByUser.value],
            tripId: trip.value._id,
            userInfo: {
                _id: null,
                fullname: userInfo.value.fullname,
                phone: userInfo.value.phone,
            }
        };

        for (let i = 0; i < bill.cart.length; i++) {
            if (bill.cart[i].count == 0) {
                bill.cart.splice(i, 1);
            }
        }

        await userStore
            .buyTrip(trip.value._id, bill)
            .then(() => {
                message.config({ duration: 3, top: "90vh" });
                message.success({ content: "Тур заказан!" });
                addCustomerDialog.value = false;
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        message.config({ duration: 3, top: "90vh" });
        message.error({ content: "Нужен телефон" });
    }
}
onMounted(async () => {
    let { data } = await tripStore.getFullTripById(route.query._id)
    trip.value = data;

    for (let book of trip.value.billsList) {
        for (let cart of book.cart) {
            let obj = {};
            if (!pricesSet.has(cart.costType)) {
                allBooks.value[cart.costType] = []
                payedBooks.value[cart.costType] = []
                pricesSet.add(cart.costType);
            }
            obj = cart.count;
            if (book.isBoughtNow == true) {
                allBooks.value[cart.costType].push(obj);
                payedBooks.value[cart.costType].push(obj);
            } else {
                allBooks.value[cart.costType].push(obj);
            }
        }
    }
    for (let pr of pricesSet) {

        let x =
            payedBooks.value[pr].reduce(
                (a, c) => a + c,
                0
            )
            ;
        payedBooks.value[pr] = x
        let y =
            allBooks.value[pr].reduce(
                (a, c) => a + c,
                0
            )
            ;
        allBooks.value[pr] = y
    }
    for (let cost of trip.value.cost) {
        selectedByUser.value.push({
            cost: cost.price,
            count: 0,
            costType: cost.first,
        });
    }
});

function getPhoneNumber(number) {
    return `tel:${number}`;
}
</script>

<template>
    <a-col :span="24" class="mb-8">
        <h3>Информация о туре</h3>
        <a-breadcrumb>
            <a-breadcrumb-item @click="router.push('/cabinet/created-trips')">{{
                trip.name
            }}</a-breadcrumb-item>
            <a-breadcrumb-item>Покупатели</a-breadcrumb-item>
        </a-breadcrumb>
    </a-col>
    <a-row class="mb-8">
        <a-col :span="24">
            <a-button size="large" class="lets_go_btn" @click="addCustomerDialog = true">добавить покупателя</a-button>
        </a-col>
    </a-row>

    <a-row :gutter="[8, 8]">
        <a-col :lg="8" :sm="12" :xs="24">
            <a-card style="height: 100%" primary>
                <div>Максимум: {{ trip.maxPeople }} чел.</div>
                <div>Забронировало:  {{ trip.billsList.length||'' }} чел.</div>
                
               
            </a-card>
        </a-col>
        <a-col :lg="8" :sm="12" :xs="24" v-for="(BILL, index) of trip.billsList">
            <div>
                <a-card hoverable class="card">
                    <div>
                        <span class="mdi mdi-account-outline" style=""></span>
                        {{ BILL.userInfo.fullname }}
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
                            BILL.cart.reduce((accumulator, object) => {
                                return accumulator + object.cost * object.count;
                            }, 0)
                        }}
                        руб.
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <div style="font-size: 20px">
                            <a-popconfirm v-if="!trip.isBoughtNow" title="Поставить оплату?" ok-text="Да" cancel-text="Нет"
                                @confirm="setPayment(BILL)">
                                <span class="mdi mdi-cash" style="cursor: pointer"></span>
                            </a-popconfirm>
                            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="deletePayment(BILL)">
                                <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
                            </a-popconfirm>
                        </div>

                        <b>
                            <span v-if="BILL.isBoughtNow" style="color: #bcc662">
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
    <a-modal v-model:visible="addCustomerDialog" :footer="null">
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
                <div>Цена</div>
                <div class="d-flex space-around align-center" v-for="(cost, index) of trip.cost" :key="index">
                    {{ cost.first }}<span>{{ cost.price }} руб. </span>
                    <div class="d-flex direction-column">
                        <span style="font-size: 8px">кол-во</span>
                        <a-input-number v-model:value="selectedByUser[index].count" :min="0"
                            :max="trip.maxPeople - tripsCount" placeholder="чел"></a-input-number>
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
</template>

<style scoped></style>
