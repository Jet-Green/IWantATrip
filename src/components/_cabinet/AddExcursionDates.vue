<script setup>
import { useExcursion } from '../../stores/excursion'

const excursionStore = useExcursion()
</script>
<template>
  <a-row>
    <a-col :span="24">
      <h3>Расписание экскурсий</h3>
    </a-col>
  </a-row>
</template>