<script setup>
import {computed, defineProps} from 'vue'
import { Icon } from '@iconify/vue';
// MDI (Apache-2.0), bundled from @iconify/json so controls work without an external icon API.
import localIcons from './local-icons.json';

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 16 },
  spin: Boolean 
});

const icon = computed(() => localIcons[props.name] || `mdi:${props.name}`);

const style = computed(() => 
  props.spin ? { animation: 'icon-spin 2s linear infinite' } : {}
);
</script>

<template>
  <Icon 
    :icon="icon"
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