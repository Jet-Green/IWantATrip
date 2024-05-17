<script setup>
defineProps({
  booking: Object
})
</script>
<template>
  <a-card hoverable class="customer-card">
    <div v-if="booking.user">
      <span class="mdi mdi-account-outline" style=""></span>
      {{ booking.user.fullinfo.fullname }}
    </div>
    <div v-else-if="booking.userInfo?.fullname">
      <span class="mdi mdi-account-outline" style=""></span>
      {{ booking.userInfo.fullname }}
    </div>
    <div v-if="booking.user">
      <span class="mdi mdi-phone-outline mr-4" style=""></span>
      <a :href="`tel:${booking.user.fullinfo.phone}`">
        {{ booking.user.fullinfo.phone }}
      </a>
    </div>
    <div v-else-if="booking.userInfo?.fullname">
      <span class="mdi mdi-phone-outline mr-4" style=""></span>
      <a :href="`tel:${booking.userInfo.phone}`">
        {{ booking.userInfo.phone }}
      </a>
    </div>
    <div style="position: absolute; bottom: 8px; right: 12px;">
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