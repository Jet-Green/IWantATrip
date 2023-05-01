<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useTrips } from "../../stores/trips";

const tripStore = useTrips();
let route = useRoute();

const _id = route.query.id;
let trip = ref({});

tripStore
    .getById(_id)
    .then((response) => {
        trip.value = response.data;
    })
    .catch((error) => {
        console.log(error);
    });

function getPhoneNumber(number) {
    return `tel:${number}`
}

</script>

<template>
    <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :xl="6" v-for="(BILL, bill_index) of trip.billsList">

            <a-card hoverable v-if="trip.billsList[bill_index]" class="pa-8" style="width: 100%;">
                <div>
                    <span class="mdi mdi-account-outline" style=""></span> {{ trip.billsList[bill_index].fullname }}
                </div>
                <div>
                    <span class="mdi mdi-phone-outline" style=""></span>
                    <a :href='getPhoneNumber(trip.billsList[bill_index].phone)'> {{ trip.billsList[bill_index].phone
                    }}</a>

                </div>
                <div v-for="cartItem of BILL.cart">
                    {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.

                </div>

                <div class="d-flex justify-end"> <span>Итого: </span> {{ BILL.cart.reduce((accumulator, object) => {
                    return
                    accumulator + object.cost * object.count;
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
    </a-row>
</template>

<style scoped></style>