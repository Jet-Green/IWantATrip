<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useTrips } from "../../stores/trips";
import { useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
import { assert } from "@vueuse/core";

const tripStore = useTrips();

let customers = ref([]);
const allBooks = ref({});
const payedBooks = ref({});
const pricesSet = new Set();
const _id = route.query.id;
let trip = ref({});

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
  // console.table(trip.value.billsList);
  for (let book of trip.value.billsList) {
    // if (book.isBoughtNow == true)
    console.log(trip)
    for (let cart of book.cart) {
      let obj = {};
      if (!pricesSet.has(cart.costType)) {
        allBooks.value[cart.costType]=[]
        payedBooks.value[cart.costType]=[]
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
  for (let Iter of pricesSet) {

    let x = 
      payedBooks.value[Iter].reduce(
        (a, c) => a + c,
        0
      )
    ;
    payedBooks.value[Iter] = x
    let y = 
      allBooks.value[Iter].reduce(
        (a, c) => a + c,
        0
      )
    ;
    allBooks.value[Iter] = y
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
        <div v-for="(value, key) in allBooks">По цене {{key}} - {{ value}} чел.</div>
        <div>Оплатило:</div>
        <div v-for="(value, key) in payedBooks">По цене {{key}} - {{ value }} чел.</div>
      </a-card>
    </a-col>
    <a-col :lg="8" :sm="12" :xs="24" v-for="(BILL, index) of trip.billsList">
      <div>
        <a-card hoverable v-if="customers[index]" class="card">
          <div>
            <span class="mdi mdi-account-outline" style=""></span>
            {{ customers[index].fullname }}
          </div>
          <div>
            <span class="mdi mdi-phone-outline" style=""></span>
            <a :href="getPhoneNumber(customers[index].phone)">
              {{ customers[index].phone }}</a
            >
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

          <div class="d-flex justify-end">
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
