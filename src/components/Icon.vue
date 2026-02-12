<script setup>
import {computed, defineProps} from 'vue'
import { Icon } from '@iconify/vue';

const props = defineProps({
  name: { type: String, required: true }, // e.g., "chevron-right"
  size: { type: [Number, String], default: 24 }, // Supports 24 or '24px'
  spin: Boolean // Optional: for loading spinners
});

// Optional: Auto-add spin animation class
const style = computed(() => 
  props.spin ? { animation: 'icon-spin 2s linear infinite' } : {}
);
</script>

<template>
  <Icon 
    :icon="`mdi:${name}`" 
    :width="size" 
    :height="size"
    :style="style"
    v-bind="$attrs"
  />
</template>

<style scoped>
@keyframes icon-spin {
  to { transform: rotate(360deg); }
}
</style>