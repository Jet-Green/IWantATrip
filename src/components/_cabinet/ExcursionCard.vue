<script setup>
import { toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useExcursion } from "../../stores/excursion";
let props = defineProps(['excursion'])
let emit = defineEmits(['updateExcursion'])



const excursionStore = useExcursion()
const router = useRouter()

// toRefs add reactivity
let {excursion} = toRefs(props)

function openAddDates(_id) {
  router.push(`/cabinet/add-excursion-dates?_id=${_id}`)
}

async function excursionToDelete(_id) {
  let response = await excursionStore.deleteById(_id);
  if (response.status == 200) {
    emit('updateExcursion')
  }
}
async function hideExcursion(_id,isHide ) {
  let response = await excursionStore.hideExcursion(_id, isHide);
  if (response.status == 200) {
    emit('updateExcursion')
  }
}
</script>
<template>
  <a-card class="card" :class="[excursion.isHidden ? 'overlay' : '']">
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

      <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="excursionToDelete(excursion._id)">
        <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
      </a-popconfirm>
      <a-popconfirm title="Скрыть?" ok-text="Да" cancel-text="Нет" @confirm="hideExcursion(excursion._id, !excursion.isHidden)">
        <span v-if="!excursion.isHidden" class="mdi mdi-eye-outline" style="cursor: pointer"></span>
        <span v-else class="mdi mdi-eye-off-outline" style="cursor: pointer"></span>
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
.overlay {

opacity: 0.5;

}
</style>