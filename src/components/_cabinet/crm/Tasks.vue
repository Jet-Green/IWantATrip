<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useAuth } from "../../../stores/auth";
import { useTasks } from "../../../stores/tasks";
import TaskCard from './TaskCard.vue';






const router = useRouter()
const route = useRoute();
const userStore = useAuth();
const taskStore = useTasks()

let showMoreButton = ref(true)
let tasks = ref([])

let search = ref('')
let page = 1
let query = {
  author: userStore.user._id,
  $or: [
    { name: { $regex: '', $options: 'i' } },
    { category: { $regex: '', $options: 'i' } }
  ]
};


let moreTasks = async () => {
  page++
  let res = await refreshTasks()

  if (res.length == tasksLenght) {
    showMoreButton.value = false
  }
  tasksLenght = res.length

}


async function refreshTasks() {
  page = 1
  let data = await taskStore.getAll(page, query)
  tasks.value = data
}

watch(search, (newSearch, oldSearch) => {

  if (newSearch.length > 2 || newSearch.length <= oldSearch.length) {
    query.$or[0].name.$regex = newSearch
    // query.$or[1].category.$regex = newSearch
    refreshTasks()
  }
})

onMounted(async () => {
  await refreshTasks()
  if (taskStore.tasks.length < 20) {
    showMoreButton.value = false
  }
})
</script>
<template>
  <div>

    <div style="display: flex; justify-content:space-between; flex-wrap:wrap" class="pa-8">
      <div>
        <a-button class="btn_light ma-8" @click="router.push('/create-task')">
          создать задачу
        </a-button>
      </div>

      <div>
        <a-input v-model:value="search" placeholder="поиск" style="width:180px" allow-clear />
      </div>

    </div>
    <a-row :gutter="[8, 8]">
      <a-col v-for="task in tasks" :span="24">

        <TaskCard @refreshTasks="refreshTasks()" :task="task">
        </TaskCard>

      </a-col>
      <a-col :span="24"  class="justify-center d-flex" @click="moreTasks()" v-if="showMoreButton"> <a-button>Ещё</a-button></a-col>
    </a-row>
  </div>
</template>