<script setup>
import { computed } from 'vue';
import { useAppState } from '../../stores/appState';
let appStateStore = useAppState()

let mainPageMessage = computed(() => {
  if (appStateStore.appState) {
    return appStateStore.appState[0].mainPageMessage;
  }
  return ''
})

</script>
<template>
  <a-row>
    <a-col :span="24" style="text-align: center">
      <h3>
        {{ mainPageMessage }}
      </h3>
    </a-col>
  </a-row>
</template>