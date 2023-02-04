<script setup>
import { onMounted, reactive, computed } from "vue";
import { useAuth } from "../../stores/auth";
import { useTrips } from "../../stores/trips";

const userStore = useAuth();
const tripStore = useTrips();

let myTrips = reactive([]);

const myTrip = (id) => {
  if (id) {
    return tripStore.getById(id).then((result) => {
      return result.data.name;
    });
  }
};

onMounted(async () => {
 
});
</script>
<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-row class="table_header">
          <a-col :md="12" :xs="4">тур</a-col>
          <a-col :md="8" :xs="12">заказан</a-col>
          <a-col :md="4">оплачен</a-col>
        </a-row>
        {{ myTrips }}
        <a-row
          v-for="(trip, index) of userStore.user.boughtTrips"
          :key="index"
          class="pt-8"
          :class="[trip.isBoughtNow ? 'even' : 'odd']"
        >
          <a-col :md="12" :xs="4"> {{ }} </a-col>
          <a-col :md="8" :xs="12">
            <div v-for="(item, index) of trip.cart" :key="index">
              <b>{{ item.costType }}:</b> {{ item.count }} шт. на
              {{ item.count * item.cost }}руб.
            </div>
          </a-col>
          <a-col :md="4" v-if="trip.isBoughtNow">да</a-col>
          <a-col :md="4" v-else><a-button>Оплатить</a-button></a-col>
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
