<script setup>
import { onMounted } from "vue";
import { useAuth } from "../../stores/auth";
import { useTrips } from "../../stores/trips";

const userStore = useAuth();

function cancelTrip(_id, user_id){
  userStore.cancelTrip(_id, user_id)
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
onMounted(async () => {
  await userStore.getBoughtTrips()
});
</script>
<template>
  <div>
    <a-row>
      <a-col :span="24">
        <h3>Вы забронировали</h3>
        <a-row :gutter="[8, 8]" class="mt-8">
          <a-col :lg="8" :sm="12" :xs="24" v-for="(bill, index) of userStore.user.boughtTrips" :key="index">
            <a-card class="card" hoverable v-if="bill.tripId?._id">
              <div style="text-align:center">{{ bill.tripId.name }} </div>
              <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
              <div>
                <span class="mdi mdi-compass-outline"></span> {{ bill.tripId.startLocation.name }}
              </div>
              <div>
                <span class="mdi mdi-calendar-arrow-right"></span>
                {{ `c ${clearData(bill.tripId.start)}` }}
                <span class="mdi mdi-calendar-arrow-left"></span>
                {{ `по ${clearData(bill.tripId.end)}` }}
              </div>
              <div v-for="cartItem of bill.tripId.cart">
                {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.
              </div>

              <div class="d-flex justify-end"> <span>Итого: </span>
                {{
                  bill.cart.reduce((accumulator, object) => {
                    return accumulator + object.cost *
                      object.count;
                  }, 0)
                }} руб.
              </div>

              <div class="d-flex justify-end">
                <div><a-button type="text" size="small" style="font-size: 14px" @click="cancelTrip(bill.tripId._id, userStore.user._id)">
                    отказаться</a-button>
                </div>
                <div v-if="bill.tripId.isBoughtNow">
                  <span style="color: #BCC662">
                    <span class="mdi mdi-check-all"></span>
                    оплачен
                  </span>
                </div>
                <div v-else><span style="color: #ff6600">
                    <span class="mdi mdi-alert-circle-outline"></span>
                    оплатить
                  </span>
                </div>
              </div>

            </a-card>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped></style>
