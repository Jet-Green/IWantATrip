<script setup>
import { onMounted } from "vue";
import { useAuth } from "../../stores/auth";
import { useTrips } from "../../stores/trips";

const userStore = useAuth();

async function updateBought() {
  userStore.getBoughtTrips()
}
async function cancelTrip(bill_id, user_id) {
  let res = await userStore.cancelTrip(bill_id, user_id)
  if (res.status == 200)
    await updateBought()
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
let tripTotalPrice = (bill) => {
  return bill.cart.reduce((accumulator, object) => {
    return accumulator + object.cost *
      object.count;
  }, 0)
}


onMounted(async () => {
  await updateBought()
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
              <div v-if="bill.tripId?.startLocation?.name">
                <MdiIcon name="compass-outline" /> {{ bill.tripId.startLocation?.name }}
              </div>
              <div>
                <MdiIcon name="calendar-arrow-right" />
                {{ `c ${clearData(bill.tripId.start)}` }}
                <MdiIcon name="calendar-arrow-left" />
                {{ `по ${clearData(bill.tripId.end)}` }}
              </div>
              <div v-for="cartItem of bill.tripId.cart">
                {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.
              </div>

              <div class="d-flex justify-end"> <span>Стоимость: </span>
                {{
                  tripTotalPrice(bill)
                }} руб.
              </div>
              <div class="d-flex justify-end"> <span>Оплачено:{{ bill.payment.amount }} руб. </span> </div>
              <!-- {{ bill }} -->
              <a-row class="actions d-flex justify-center">
                <a-popconfirm title="Отказаться?" ok-text="Да" cancel-text="Нет"
                  @confirm="cancelTrip(bill._id, userStore.user._id)">
                  <MdiIcon v-if="!bill.payment.amount" name="close-circle-outline" />
                </a-popconfirm>
                <a-col v-if="bill.tripId.isBoughtNow"><span style="color: #BCC662;">
                    <MdiIcon name="check-all" />
                    оплачен
                  </span></a-col>
                <a-popconfirm v-else title="Оплатить?" ok-text="Да" cancel-text="Нет" @confirm="">
                  <MdiIcon v-if="tripTotalPrice(bill)  name =" cart-outline" />
                </a-popconfirm>
              </a-row>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
.actions {
  font-size: 20px;
  position: relative;

  * {
    margin: 4px;
    cursor: pointer;
  }
}
</style>
