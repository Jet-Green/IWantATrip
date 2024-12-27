<script setup>
import { toRefs, computed, ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import datePlugin from "../../../plugins/dates"

let props = defineProps(['task'])
let emit = defineEmits(['refreshTasks'])
import { useTasks } from "../../../stores/tasks"

const router = useRouter()
const taskStore = useTasks()
let color = ref('black')
let show = ref(false)
// toRefs add reactivity
let { task } = toRefs(props)



async function taskToDelete(_id) {
  let response = await taskStore.deletePlace(_id);
  if (response.status == 200) {
    emit('refreshTasks')
  }
}



</script>
<template>
  <a-card class="card" v-if="task._id">
    <div style="width: 100%; height: 100%; text-align: center; font-weight: 700;">
      {{ task.name }}
    </div>
    {{ task }}
    {{ datePlugin.excursions.getLocalDateFromUTC(task.deadLine, task.timezoneOffset) }}
    <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
    <div class="actions">
      <div>

        <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="taskToDelete(task._id)">
          <span class="mdi mdi-delete" style="color: #ff6600;"></span>
        </a-popconfirm>


        <a-popconfirm title="Редактировать?" ok-text="Да" cancel-text="Нет"
          @confirm="router.push(`/create-task?_id=${task._id}`)">
          <span class="mdi mdi-pen"></span>
        </a-popconfirm>

      </div>


    </div>

  </a-card>
</template>
<style scoped lang="scss">
.actions {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  cursor: pointer;
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