<script setup>
import { useRouter } from 'vue-router';
let props = defineProps(['excursion'])

const router = useRouter()

let excursion = props.excursion

function openAddDates(_id) {
  router.push(`/cabinet/add-excursion-dates?_id=${_id}`)
}

</script>
<template>
  <a-card class="card">
    <div style="width: 100%; text-align: center;">
      {{ excursion.name }}
    </div>
    <div>
      {{ excursion.excursionType.type }}
    </div>
    <div class="type">
      <span class="mdi mdi-directions-fork"></span>{{ excursion.excursionType.directionType }}

      <span class="mdi mdi-map-marker-outline"></span>{{ excursion.excursionType.directionPlace }}
    </div>
    <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
    <div class="actions">
      <a-popconfirm title="Добавить расписание?" ok-text="Да" cancel-text="Нет" @confirm="openAddDates(excursion._id)">
        <span class="mdi mdi-calendar-month-outline" style="cursor: pointer"></span>
      </a-popconfirm>
    </div>
  </a-card>
</template>
<style scoped lang="scss">
.actions {
  font-size: 20px;
  position: relative;
  color: #245159;

  * {
    margin: 4px;
    cursor: pointer;
  }
}
.type {
  display: flex; 
  align-items: center;
  span {
    font-size: 20px;
  }
}
</style>