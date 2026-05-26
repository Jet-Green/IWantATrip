<script setup>
import { computed } from 'vue'

const props = defineProps({
  canSellPartnerTour: { type: Boolean, default: true },
})
const emit = defineEmits(['update:canSellPartnerTour'])

const value = computed({
  get: () => props.canSellPartnerTour,
  set: (v) => emit('update:canSellPartnerTour', v),
})
</script>

<template>
  <div class="partner-payment-choice">
    <div class="partner-payment-choice__label">Оплата в приложении</div>
    <a-radio-group v-model:value="value">
      <a-radio :value="true">Принимать</a-radio>
      <a-radio :value="false">Не принимать</a-radio>
    </a-radio-group>
  </div>
</template>

<style scoped>
.partner-payment-choice__label {
  margin-bottom: 8px;
  font-weight: 500;
}
</style>
