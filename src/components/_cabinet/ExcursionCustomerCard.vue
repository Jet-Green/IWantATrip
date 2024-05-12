<script setup>
defineProps({
  bill: Object
})
function getBillSum(bill) {
  let sum = 0
  for (let p of bill.cart) {
    sum += p.price * p.count
  }
  return sum
}
</script>
<template>
  <a-card hoverable class="customer-card">
    <div class="d-flex space-between"></div>
    <div>
      <span class="mdi mdi-account-outline" style=""></span>
      {{ bill.user.fullinfo.fullname }}
    </div>
    <div>
      <span class="mdi mdi-map-marker-outline" style=""></span>
      {{ bill.user.userLocation.name }}
    </div>
    <div>
      <span class="mdi mdi-phone-outline mr-4" style=""></span>
      <a :href="`tel:${bill.user.fullinfo.phone}`">
        {{ bill.user.fullinfo.phone }}
      </a>
    </div>
    <div v-for="cartItem of bill.cart" class="cart-container">
      {{ cartItem.type }} {{ cartItem.count }} x {{ cartItem.price }}₽
    </div>
    <div class="sum">
      Итого: {{ getBillSum(bill) }}₽
    </div>
  </a-card>
</template>
<style lang="scss" scoped>
.customer-card {
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
  height: 100%;

  .cart-container {
    display: flex;
  }

  .sum {
    display: flex;
    justify-content: end;
  }
}
</style>