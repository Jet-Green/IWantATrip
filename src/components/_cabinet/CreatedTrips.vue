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
  const dataFromString = new Date(Number(dataString));

  return dataFromString.toLocaleDateString("ru-Ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
};
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
      <a-row class="table_header">
        <a-col :md="2" :xs="4"></a-col>
        <a-col :md="8" :xs="12">название</a-col>
        <a-col :md="4" v-if="!sm">направление</a-col>
        <a-col :md="3" v-if="!sm">дата начала</a-col>
        <a-col :md="3" v-if="!sm">дата конца</a-col>
        <a-col :md="4" :xs="8">действия</a-col>
      </a-row>

      <a-row v-for="(trip, index) of trips" :key="index" class="mt-4 pa-8"
        :class="[index % 2 ? 'odd' : 'even', trip.isHidden ? 'overlay' : '']">
        <a-col :md="2" :xs="4">
          <img :src="trip.images[0]" @click="goToTripPage(trip._id)" />
        </a-col>
        <a-col :md="8" :xs="12" @click="goToTripPage(trip._id)">{{ trip.name }}</a-col>
        <a-col :md="4" v-if="!sm">{{ trip.location }}</a-col>
        <a-col :md="3" v-if="!sm"> {{ clearData(trip.start) }}</a-col>
        <a-col :md="3" v-if="!sm">{{ clearData(trip.end) }}</a-col>
        <a-col :md="4" :xs="8">
          <div class="actions">
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="tripToDelete(trip._id)"
              v-if="!trip.billsList.length > 0">
              <span class="mdi mdi-delete" style="color: red; cursor: pointer"></span>
            </a-popconfirm>
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="editTrip(trip._id)">
              <span class="mdi mdi-pen" style="color: #245159; cursor: pointer"></span>
            </a-popconfirm>
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="hideTrip(trip._id)">
              <span v-if="!trip.isHidden" class="mdi mdi-eye" style="color: #245159; cursor: pointer"></span>
              <span v-else class="mdi mdi-eye-off" style="color: #245159; cursor: pointer"></span>
            </a-popconfirm>
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="copyTrip(trip._id)">
              <span v-if="!trip.isHidden" class="mdi mdi-content-copy" style="color: #245159; cursor: pointer"></span>
            </a-popconfirm>
            <span class="mdi mdi-information-outline" @click="showBills(index)"></span>
          </div>
        </a-col>
        <transition name="fade">
          <a-col :span="24" v-if="visibleBills[index]">
            <a-row style="display: flex; justify-content: space-between;">
              <a-col :xs="24" :md="12" :lg="8" class="pa-4" v-for="(BILL, bill_index) of trip.billsList">
                <a-popover placement="bottom" trigger="click">
                  <template #content>
                    <a-row>
                      <a-col :span="24" v-for="cartItem of BILL.cart">
                        {{ cartItem.costType }} {{ cartItem.cost }} руб. {{ cartItem.count }} шт.
                        <a-divider class="ma-0" v-if="BILL.cart.length > 1" />
                      </a-col>
                    </a-row>
                  </template>
                  <a-card hoverable v-if="trip.customers[bill_index]" class="pa-8">
                    <a-row>
                      <a-col :span="12">
                        <a-row>
                          <a-col :span="24">
                            <span class="mdi mdi-account-outline" style="font-size: 20px;"></span>
                            {{ trip.customers[bill_index].fullname }}
                          </a-col>
                          <a-col :span="24">
                            <span class="mdi mdi-phone-outline" style="font-size: 20px;"></span>
                            {{ trip.customers[bill_index].phone }}
                          </a-col>
                          <a-col :span="24">
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
                          </a-col>
                        </a-row>
                      </a-col>
                      <a-col :span="12">
                        <a-row v-if="BILL.cart">
                          <a-col :span="24">
                            <span class="mdi mdi-account-group" style="font-size: 20px;"></span>
                            {{
                              BILL.cart.reduce((accumulator, object) => {
                                return accumulator + object.count;
                              }, 0)
                            }}
                          </a-col>
                          <a-col :span="24">
                            <span class="mdi mdi-cash" style="font-size: 20px;"></span>
                            {{
  BILL.cart.reduce((accumulator, object) => {
    return accumulator + object.cost *
      object.count;
  }, 0)
                            }} ₽
                          </a-col>
                        </a-row>
                      </a-col>
                    </a-row>
                  </a-card>
                </a-popover>
              </a-col>
            </a-row>
          </a-col>
        </transition>
      </a-row>
    </a-col>
  </a-row>
</template>
<style scoped lang="scss">
.actions {
  font-size: 20px;
  position: relative;

  * {
    margin: 8px;
    cursor: pointer;
  }
}

.title {
  font-size: 16px;
  text-transform: uppercase;
  text-align: center;
}

.odd {
  background: rgba(255, 102, 0, 0.05);
}

.even {
  background: rgba(34, 176, 214, 0.05);
}

.overlay {

  opacity: 0.5;

}

img {
  width: 100%;
  height: 50px;
  aspect-ratio: 270/175;
  object-fit: cover;
}
</style>