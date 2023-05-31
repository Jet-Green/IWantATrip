<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useTrips } from "../../stores/trips";
import { useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const tripStore = useTrips();

const priceList = ref([])
const allBooks = ref(0)
const payedBooks = ref(0)

let trip = ref({});

onMounted(async () => {
    // get trip
    let { data } = await tripStore.getFullTripById(route.query._id)
    trip.value = data

    for (let price of trip.value.cost) {
        priceList.value.push({
            price: Number(price.price),
            count: 0
        })
    }

    // extract data
    for (let bill of trip.value.billsList) {
        // make priceList
        for (let cartItem of bill.cart) {
            for (let price of priceList.value) {
                price.count += cartItem.count
            }
            // payedBooks.value
            if (bill.isBoughtNow) {
                payedBooks.value += cartItem.count
            }
            allBooks.value += cartItem.count
        }
    }
});

function getPhoneNumber(number) {
    return `tel:${number}`
}
</script>

<template>
    <a-col :span="24" class="mb-8">
        <h3>Информация о туре</h3>
        <a-breadcrumb>
            <a-breadcrumb-item @click="router.push('/cabinet/created-trips')">{{ trip.name }}</a-breadcrumb-item>
            <a-breadcrumb-item>Покупатели</a-breadcrumb-item>
        </a-breadcrumb>
    </a-col>

    <a-row :gutter="[8, 8]">
        <a-col :lg="8" :sm="12" :xs="24">
            <a-card style="height: 100%;">
                <div>Максимум: {{ trip.maxPeople }} чел.</div>
                <div>Забронировало: {{ allBooks }} чел.</div>
                <div>Оплатило: {{ payedBooks }} чел.</div>
                <div v-for="price in priceList">{{ price.price }} руб. купило {{ price.count }}</div>
            </a-card>
        </a-col>
        <a-col :lg="8" :sm="12" :xs="24" v-for="(BILL, index) of trip.billsList">

            <div>
                <a-card hoverable v-if="BILL.userInfo" class="card">
                    <div>
                        <span class="mdi mdi-account-outline"></span> {{ BILL.userInfo.fullinfo?.fullname }}
                    </div>
                    <div>
                        <span class="mdi mdi-phone-outline"></span>
                        <a :href='getPhoneNumber(BILL.userInfo.fullinfo?.phone)'> {{ BILL.userInfo.fullinfo?.phone
                        }}</a>
                    </div>
                    <div v-for="cartItem of BILL.cart">
                        {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.
                    </div>

                    <div class="d-flex justify-end"> <span>Итого: </span> {{ BILL.cart.reduce((accumulator, object) => {
                        return accumulator + object.cost * object.count;
                    }, 0) }} руб.
                    </div>

                    <div class="d-flex justify-end">
                        <b>
                            <span v-if="BILL.isBoughtNow" style="color: #BCC662">
                                <span class="mdi mdi-check-all" style="font-size: 20px;"></span>
                                оплачен
                            </span>
                            <span v-else style="display: flex; align-items: center;">
                                <span class="mdi mdi-close" style="font-size: 20px;"></span>
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