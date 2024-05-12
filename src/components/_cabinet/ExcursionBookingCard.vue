<script setup>
defineProps({
  booking: Object
})
</script>
<template>
  <a-card hoverable class="customer-card">
    <div class="d-flex space-between"></div>
    <div>
      <span class="mdi mdi-account-outline" style=""></span>
      {{ booking.user.fullinfo.fullname }}
    </div>
    <div>
      <span class="mdi mdi-map-marker-outline" style=""></span>
      {{ booking.user.userLocation.name }}
    </div>
    <div>
      <span class="mdi mdi-phone-outline mr-4" style=""></span>
      <a :href="`tel:${booking.user.fullinfo.phone}`">
        {{ booking.user.fullinfo.phone }}
      </a>
    </div>
    <div class="d-flex" style="justify-content: end;">
        <b>{{ booking.count }}&nbsp;чел.</b>
    </div>
  </a-card>
</template>
<style lang="scss" scoped>
.customer-card {
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;

  .cart-container {
    display: flex;
  }

  .sum {
    display: flex;
    justify-content: end;
  }
}
</style>