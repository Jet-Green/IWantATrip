<script setup>
import { ref, onMounted } from 'vue'

import { useExcursion } from '../../stores/excursion'

let excursions = ref([])

const excursionStore = useExcursion()

onMounted(async () => {
  let response = await excursionStore.getUserExcursions()
  excursions.value = response.data
})
</script>
<template>
  <a-row>
    <a-col :span="24">
      <h3>Расписание экскурсий</h3>
    </a-col>
    <a-col v-for="excursion in excursions" :span="24" :sm="12" :md="8">
      <a-card class="card">
        <template #title>
          {{ excursion.name }}
        </template>
        <div class="actions">
          <a-popconfirm title="Добавить расписание?" ok-text="Да"
            cancel-text="Нет" @confirm="">
            <span class="mdi mdi-calendar-month-outline" style="cursor: pointer"></span>
          </a-popconfirm>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>
<style scoped lang="scss">
.card {}
.actions {
  font-size: 20px;
    position: relative;
    color: #245159;

    * {
        margin: 4px;
        cursor: pointer;
    }
}
</style>