<script setup>
import { useExcursion } from '../../stores/excursion';
const excursionStore = useExcursion()


let emit = defineEmits(['updateExcursion'])
defineProps({
  booking: Object
})

async function deleteExcursionBooking(_id) {
  let response = await excursionStore.deleteExcursionBooking(_id);
  if (response.status == 200) {
    emit('updateExcursion')
  }
}
</script>
<template>
  <a-card hoverable class="customer-card">
    <div v-if="booking.user">
      <MdiIcon style="" name="account-outline" />
      {{ booking.user.fullinfo.fullname }}
    </div>
    <div v-else-if="booking.userInfo?.fullname">
      <MdiIcon style="" name="account-outline" />
      {{ booking.userInfo.fullname }}
    </div>
    <div v-if="booking.user">
      <MdiIcon style="" name="phone-outline" class="mr-4" />
      <a :href="`tel:${booking.user.fullinfo.phone}`">
        {{ booking.user.fullinfo.phone }}
      </a>
    </div>
    <div v-else-if="booking.userInfo?.fullname">
      <MdiIcon style="" name="phone-outline" class="mr-4" />
      <a :href="`tel:${booking.userInfo.phone}`">
        {{ booking.userInfo.phone }}
      </a>
    </div>
    <div>
      <b>{{ booking.count }}&nbsp;чел.</b>
    </div>
    <div class="actions d-flex">
      <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="deleteExcursionBooking(booking._id)">
        <MdiIcon style="color: #ff6600; cursor: pointer" name="delete" />
      </a-popconfirm>

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
.actions {
  font-size: 20px;
  color: #245159;

  * {
    margin: 4px;
    cursor: pointer;
  }
}
</style>