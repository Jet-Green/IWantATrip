<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useTrips } from "../../stores/trips";
import { useRouter } from "vue-router";

const tripStore = useTrips();
let route = useRoute();
const router = useRouter();
let customers = ref([])
const allBooks = ref([])
const payedBooks = ref({})
const _id = route.query.id;
let trip = ref({});

onMounted(async () => {
    let { data } = await tripStore.getById(_id)
    trip.value = data

    let customersIds = []
    for (let bill of trip.value.billsList) {
        customersIds.push(bill.userId)
    }
    if (customersIds.length) {
        let { data } = await tripStore.getCustomers(customersIds)
        customers.value = data

    }
    console.log(trip.value.billsList)
    for (let book of trip.value.billsList){
        if (book.isBoughtNow==true){
            if ( payedBooks[book.cart[0].costType]==Object.keys(payedBooks))
            payedBooks[book.cart[0].costType] = book.cart[0].count     
        }
        allBooks.value = allBooks.value + book.cart[0].count
    
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
            <div>Забронировало: {{ allBooks}} чел.</div>
            <div>Оплатило: {{ payedBooks }} чел.</div>
            <div v-for="price in priceList">{{ price }} купило {{ x }}</div>
        </a-card>
        </a-col>
        <a-col :lg="8" :sm="12" :xs="24" v-for="(BILL, index) of trip.billsList">

            <div>
                <a-card hoverable v-if="customers[index]" class="card">
                    <div>
                        <span class="mdi mdi-account-outline" style=""></span> {{ customers[index].fullname }}
                    </div>
                    <div>
                        <span class="mdi mdi-phone-outline" style=""></span>
                        <a :href='getPhoneNumber(customers[index].phone)'> {{ customers[index].phone
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