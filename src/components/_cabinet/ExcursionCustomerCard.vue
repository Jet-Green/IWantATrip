<script setup>
import { ref } from 'vue';
import { useExcursion } from '../../stores/excursion';
import tinkoffPlugin from '../../plugins/tinkoff'
import TinkoffLogo from "../../assets/images/tinkofflogo.svg"

const excursionStore = useExcursion()

let emit = defineEmits(['updateExcursion'])
let props = defineProps({
  bill: Object
})
function getBillSum(bill) {
  let sum = 0
  for (let p of bill.cart) {
    sum += p.price * p.count
  }
  return sum
}

let payedByTinkoff = ref(false)
if (props.bill.tinkoff) {
  let res = await tinkoffPlugin.checkPayment(props.bill.tinkoff.paymentId, props.bill.tinkoff.token)
  if (res.data.Status == "CONFIRMED") {
    payedByTinkoff.value = true
  }
}

async function deleteExcursionBill(_id) {
  let response = await excursionStore.deleteExcursionBill(_id);
  if (response.status == 200) {
    emit('updateExcursion')
  }
}
</script>
<template>
  <a-card hoverable class="customer-card">

    <div>
      <div v-if="bill.userInfo">
        <span class="mdi mdi-account-outline" style=""></span>
        {{ bill?.userInfo.fullname }}
      </div>
      <div v-else>
        <span class="mdi mdi-account-outline" style=""></span>
        {{ bill?.user.fullinfo.fullname }}
      </div>
   
      <div v-if="bill.userInfo">
        <span class="mdi mdi-phone-outline mr-4" style=""></span>
        <a :href="`tel:${bill.userInfo.phone}`">
          {{ bill?.userInfo.phone }}
        </a>
      </div>
      <div v-else>
        <span class="mdi mdi-phone-outline mr-4" style=""></span>
        <a :href="`tel:${bill.user.fullinfo.phone}`">
          {{ bill.user?.fullinfo.phone }}
        </a>
      </div>
     
      <div v-for="cartItem of bill.cart" :key="cartItem.index" class="cart-container">
        {{ cartItem.type }} {{ cartItem.count }} x {{ cartItem.price }}₽
      </div>
      <div class="sum">
        Итого: {{ getBillSum(bill) }}₽
      </div>
      <div v-if="payedByTinkoff" class="d-flex justify-end">
        <img :src="TinkoffLogo" class="tinkoff-logo">
      </div>
    </div>
    <div class="actions d-flex">
      <a-popconfirm v-if="!payedByTinkoff" title="Удалить?" ok-text="Да" cancel-text="Нет"
        @confirm="deleteExcursionBill(bill._id)">
        <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
      </a-popconfirm>
    </div>
  </a-card>
</template>
<style lang="scss" scoped>
.customer-card {
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .sum {
    display: flex;
    justify-content: end;
  }
  .tinkoff-logo {
    height: 20px;
    width: 90px;
  }

  img {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
}

.actions {
  font-size: 20px;
  color: #245159;

  * {
    margin: 4px;
    cursor: pointer;
  }
}
</style>