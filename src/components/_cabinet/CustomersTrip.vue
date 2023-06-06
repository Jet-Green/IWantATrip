<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useTrips } from "../../stores/trips";
import { useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const tripStore = useTrips();

let customers = ref([]);
const allBooks = ref({});
const payedBooks = ref({});
const pricesSet = new Set();
const _id = route.query.id;
let trip = ref({});

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
function deletePayment(bill) {
    console.log(bill);
}
onMounted(async () => {
    let { data } = await tripStore.getFullTripById(route.query._id)
    trip.value = data;

    let customersIds = [];
    for (let bill of trip.value.billsList) {
        customersIds.push(bill.userId);
    }
    if (customersIds.length) {
        let { data } = await tripStore.getCustomers(customersIds);
        customers.value = data;
    }

    for (let book of trip.value.billsList) {
        // if (book.isBoughtNow == true)
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
                allBooks.value[cart.costType].push(obj);;
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

    <a-row :gutter="[8, 8]">
        <a-col :lg="8" :sm="12" :xs="24">
            <a-card style="height: 100%">
                <div>Максимум: {{ trip.maxPeople }} чел.</div>
                <div>Забронировало:</div>
                <div v-for="(value, key) in allBooks">По цене {{ key }} - {{ value }} чел.</div>
                <div>Оплатило:</div>
                <div v-for="(value, key) in payedBooks">По цене {{ key }} - {{ value }} чел.</div>
            </a-card>
        </a-col>
        <a-col :lg="8" :sm="12" :xs="24" v-for="(BILL, index) of trip.billsList">
            <div>
                <a-card hoverable class="card">
                    <div>
                        <span class="mdi mdi-account-outline" style=""></span>
                        {{ BILL.userInfo.fullinfo.fullname }}
                    </div>
                    <div>
                        <span class="mdi mdi-phone-outline" style=""></span>
                        <a :href="getPhoneNumber(BILL.userInfo.fullinfo.phone)">
                            {{ BILL.userInfo.fullinfo.phone }}</a>
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
                            <a-popconfirm title="Поставить оплату?" ok-text="Да" cancel-text="Нет"
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
</template>

<style scoped></style>
