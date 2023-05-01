<script setup>
import { ref, onMounted, computed } from "vue";
import TripService from "../../service/TripService";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useAuth } from "../../stores/auth.js";
import { useTrips } from "../../stores/trips.js";

let userStore = useAuth();
let router = useRouter();

let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");

let tripStore = useTrips();
let trips = ref([]);
let tripsIds = computed(() => userStore.user.trips);

function goToTripPage(_id) {
  router.push(`/trip?_id=${_id}`);
}
async function tripToDelete(_id) {
  let { response } = await tripStore.deleteById(_id);
  let { status } = response

  if (status != "400") {
    for (let i = 0; i < trips.value.length; i++) {
      if (trips.value[i]._id == _id) {
        trips.value.splice(i, 1);
      }
    }
  }
}

function getPhoneNumber(number) {
  return `tel:${number}`
}

function editTrip(_id) {
  router.push(`/edit-trip?_id=${_id}`);
}

function copyTrip(_id) {
  router.push(`/create-no-help?_id=${_id}`);
}
async function hideTrip(_id) {
  for (let t of trips.value) {
    if (t._id == _id) {
      t.isHidden = !t.isHidden;
      TripService.hideTrip(_id, t.isHidden);
    }
  }
}
let visibleBills = ref([])
function showBills(index) {
  visibleBills.value[index] = !visibleBills.value[index]
}

const clearData = (dataString) => {
  let date
  if (dataString.length == 13) {
    const dataFromString = new Date(Number(dataString));
    date = dataFromString

  } else {
    date = new Date(dataString)
  };
  return date.toLocaleDateString("ru-Ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",

  })
}
let customers = ref([])
onMounted(async () => {
  for (let _id of tripsIds.value) {
    let res = await tripStore.getById(_id);

    if (res.data) {
      let billsListFromDB = res.data.billsList

      let customersIds = []
      for (let bill of billsListFromDB) {
        customersIds.push(bill.userId)
      }

      if (customersIds.length) {
        let { data } = await tripStore.getCustomers(customersIds)
        res.data.customers = data
      }

      trips.value.push(res.data);
      visibleBills.value.push(false)
    }
  }

});
</script>
<template>
  <a-row>
    <a-col :span="24">
      <a-row :gutter="[8, 8]" class="mt-8">
        <a-col :lg="8" :sm="12" :xs="24" v-if="trips.length > 0" v-for="(trip, index) of trips" :key="index">
          <a-card class="card " hoverable :class="[trip.isHidden ? 'overlay' : '']">
            <div style="text-align:center">
              {{ trip.name }}
            </div>
            <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
            <div>
              <span class="mdi mdi-compass-outline"></span>{{ trip.location }}
            </div>
            <div>
              <span class="mdi mdi-calendar-arrow-right"></span>
              {{ `c ${clearData(trip.start)}` }}
              <span class="mdi mdi-calendar-arrow-left"></span>
              {{ `по ${clearData(trip.end)}` }}
            </div>

            <div class="actions d-flex justify-center">
              <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="tripToDelete(trip._id)"
                v-if="!trip.billsList.length > 0">
                <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
              </a-popconfirm>
              <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="editTrip(trip._id)">
                <span class="mdi mdi-pen" style="color: #245159; cursor: pointer"></span>
              </a-popconfirm>
              <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="hideTrip(trip._id)">
                <span v-if="!trip.isHidden" class="mdi mdi-eye" style="color: #245159; cursor: pointer"></span>
                <span v-else class="mdi mdi-eye-off" style="color: #245159; cursor: pointer"></span>
              </a-popconfirm>
              <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="copyTrip(trip._id)">
                <span class="mdi mdi-content-copy" style="color: #245159; cursor: pointer"></span>
              </a-popconfirm>
              <span class="mdi mdi-information-outline" @click="router.push({path:'/customers-trip',params:{trip, index}})" v-if="trip.billsList.length"></span>
            </div>
          </a-card>

          <!-- <a-modal v-model:visible="visibleBills[index]" :title="trip.name" :footer="null" width="100%">

            <a-row :gutter="[16, 16]">
              <a-col :xs="24" :sm="12" :xl="6" v-for="(BILL, bill_index) of trip.billsList">

                <a-card hoverable v-if="trip.customers[bill_index]" class="pa-8" style="width: 100%;">
                  <div>
                    <span class="mdi mdi-account-outline" style=""></span>
                    {{ trip.customers[bill_index].fullname }}
                  </div>
                  <div>
                    <span class="mdi mdi-phone-outline" style=""></span>
                    <a :href='getPhoneNumber(trip.customers[bill_index].phone)'> {{ trip.customers[bill_index].phone
                    }}</a>

                  </div>
                  <div v-for="cartItem of BILL.cart">
                    {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.

                  </div>

                  <div class="d-flex justify-end"> <span>Итого: </span>
                    {{
                      BILL.cart.reduce((accumulator, object) => {
                        return accumulator + object.cost *
                          object.count;
                      }, 0)
                    }} руб.
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
          </a-modal> -->
        </a-col>
      </a-row>

    </a-col>
  </a-row>
</template>
<style scoped lang="scss">
.actions {
  font-size: 20px;
  position: relative;

  * {
    margin: 4px;
    cursor: pointer;
  }
}



.overlay {

  opacity: 0.5;

}



.card {

  background: #f6f6f6;
  padding: 8px;
}
</style>