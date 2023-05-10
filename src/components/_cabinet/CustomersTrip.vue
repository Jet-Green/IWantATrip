<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useTrips } from "../../stores/trips";
import { useRouter } from "vue-router";

const tripStore = useTrips();
let route = useRoute();
const router = useRouter();

const _id = route.query.id;
let trip = ref([]);

onMounted(async () => {
    let { data } = await tripStore.getById(_id)
    trip.value = data

    let customersIds = []
    for (let bill of trip.value.billsList) {
        customersIds.push(bill.userId)
    }
    if (customersIds.length) {
        let { data } = await tripStore.getCustomers(customersIds)
        trip.value.customers = data
        console.log(trip.value)
    }

});

function getPhoneNumber(number) {
    return `tel:${number}`
}

</script>

<template>
    <a-col :span="24" class="mb-8">
        <h3>Вы создали</h3>
        <a-breadcrumb>
            <a-breadcrumb-item @click="router.back()">{{ trip.name }}</a-breadcrumb-item>
            <a-breadcrumb-item>Покупатели</a-breadcrumb-item>
        </a-breadcrumb>
    </a-col>
    <a-col :xs="24" :sm="12" :xl="6" v-for="(BILL, bill_index) of trip.billsList">

        <a-card hoverable v-if="trip.customers[bill_index]" class="pa-8">
            <div>
                <span class="mdi mdi-account-outline" style=""></span> {{ trip.customers[bill_index].fullname }}
            </div>
            <div>
                <span class="mdi mdi-phone-outline" style=""></span>
                <a :href='getPhoneNumber(trip.customers[bill_index].phone)'> {{ trip.customers[bill_index].phone
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

    </a-col>
</template>

<style scoped></style>