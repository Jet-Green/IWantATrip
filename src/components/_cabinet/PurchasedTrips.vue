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
onMounted(() => {
  myTrip();
});
</script>
<template>
  <div>
    <a-row>
      <a-col :span="24">
        <h3>Вы забронировали</h3>
        <a-row :gutter="[8, 8]" class="mt-8">
          <a-col :lg="8" :sm="12" :xs="24" v-for="(trip, index) of userStore.user.boughtTrips" :key="index">
            <a-card class="card " hoverable>
              <div style="text-align:center">{{ boughtTrips[index] ? boughtTrips[index].name : "" }} </div>
              <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
              <div>
                <span class="mdi mdi-compass-outline"></span> {{ boughtTrips[index] ? boughtTrips[index].location : "" }}
              </div>
              <div>
                <span class="mdi mdi-calendar-arrow-right"></span>
                {{ `c ${boughtTrips[index] ? clearData(boughtTrips[index].start) : ''}` }}
                <span class="mdi mdi-calendar-arrow-left"></span>
                {{ `по ${boughtTrips[index] ? clearData(boughtTrips[index].end) : ''}` }}
              </div>
              <div v-for="cartItem of trip.cart">
                {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.

              </div>

              <div class="d-flex justify-end"> <span>Итого: </span>
                {{
                  trip.cart.reduce((accumulator, object) => {
                    return accumulator + object.cost *
                      object.count;
                  }, 0)
                }} руб.
              </div>


              <div class="d-flex justify-end" v-if="trip.isBoughtNow">
                <span style="color: #BCC662">
                  <span class="mdi mdi-check-all" style="font-size: 20px;"></span>
                  оплачен
                </span>
              </div>
              <div class="d-flex justify-end" v-else><span style="color: #ff6600">
                  <span class="mdi mdi-alert-circle-outline" style="font-size: 20px;"></span>
                  оплатить
                </span></div>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>

</style>
