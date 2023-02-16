<script setup>
import { onMounted, reactive, computed, ref } from "vue";
import { useAuth } from "../../stores/auth";
import { useTrips } from "../../stores/trips";

const userStore = useAuth();
const tripStore = useTrips();
let boughtTrips = reactive([]);

const myTrip = async () => {
  if (userStore.user.boughtTrips) {
    for (let i = 0; i < userStore.user.boughtTrips.length; i++) {
      await tripStore
        .getById(userStore.user.boughtTrips[i].tripId)
        .then((data) => {
          boughtTrips.push(data.data);
        });
    }
  }
};
onMounted(() => {
  myTrip();
});
</script>
<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-row class="table_header">
          <a-col :md="12" :xs="24">тур</a-col>
          <a-col :md="8" :xs="12">заказан</a-col>
          <a-col :md="4" :xs="12">оплачен</a-col>
        </a-row>
        <a-row
          v-for="(trip, index) of userStore.user.boughtTrips"
          :key="index"
          class="pt-8"
          :class="[trip.isBoughtNow ? 'even' : 'odd']"
        >
          <a-col :md="12" :xs="24">
            {{ boughtTrips[index] ? boughtTrips[index].name : "нет названия" }}
            с
            {{ boughtTrips[index] ? boughtTrips[index].start : "нет даты" }}
          </a-col>
          <a-col :md="8" :xs="12">
            <div v-for="(item, index) of trip.cart" :key="index">
              <b>{{ item.costType }}:</b> {{ item.count }} шт. на
              {{ item.count * item.cost }}руб.
            </div>
          </a-col>
          <a-col :md="4" :xs="12" v-if="trip.isBoughtNow">да</a-col>
          <a-col :md="4" :xs="12" v-else><a-button>Оплатить</a-button></a-col>
          <a-divider class="ma-0"></a-divider>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
.odd {
  background: rgba(255, 102, 0, 0.05);
}

.even {
  background: rgba(34, 176, 214, 0.05);
}
</style>
