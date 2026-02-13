<script setup>
import {computed, defineProps} from 'vue'
import { Icon } from '@iconify/vue';

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 16 },
  spin: Boolean 
});

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
    :inline="true"
  />
</template>

<style scoped>
@keyframes icon-spin {
  to { transform: rotate(360deg); }
}
</style>