<script setup>
import { ref, onMounted, computed, watch } from "vue"
import { useRouter } from "vue-router"
import { useRoute } from "vue-router"
import { useAuth } from "../../../stores/auth"
import { useTasks } from "../../../stores/tasks"
import TaskCard from "./TaskCard.vue"
import dayjs from "dayjs"
import "dayjs/locale/ru"
import localeData from "dayjs/plugin/localeData"
import updateLocale from "dayjs/plugin/updateLocale"
import ruRU from "ant-design-vue/es/locale/ru_RU"

dayjs.extend(localeData)
dayjs.extend(updateLocale)

// Устанавливаем русский язык как основной
dayjs.locale("ru")
const locale = ruRU
// для языка календаря

import { date } from "yup"



const router = useRouter()

const userStore = useAuth()
const taskStore = useTasks()

let isCreator =  userStore.user.tinkoffContract||false
let showMoreButton = ref(true)
let tasks = ref([])
let tasksAmount = ref([])
let isCalendarVisible = ref(false)

let search = ref("")
let page = 1
let query = {
  status: "open",
  $and: [
    {
      $or: [
        { author: userStore.user._id },
        { managers: userStore.user._id }
      ]
    },
    {
      $or: [
        { name: { $regex: "", $options: "i" } },
        { 'tripInfo.name': { $regex: '', $options: 'i' } }
      ]
    }
  ],
  'tripInfo.end': {
    $gte: Date.now() + new Date().getTimezoneOffset() * 60 * 1000
  },


}

const CURRENT_OFFSET = new Date().getTimezoneOffset() * 60 * 1000

const selectedDate = ref(undefined)
const activeDate = ref(null)
const events = computed(() => {
  return tasksAmount.value.map((item) => ({
    date: dayjs(item.deadLine - CURRENT_OFFSET)
      .startOf("day")
      .valueOf(),
  }))
})

function getTasks(currentDate) {

  currentDate = dayjs(currentDate).startOf("day")

  return events.value.filter((event) => {
    return Date.parse(currentDate) == event.date

  })
}
async function getTasksAmount() {
  //добавить менеджера через $or

  let query = {
    status: "open",
    $or: [
    { author: userStore.user._id },
    { managers: userStore.user._id }
  ],
    'tripInfo.end': {
      $gte: Date.now() + new Date().getTimezoneOffset() * 60 * 1000
    }

  }
  let res = await taskStore.getTasksAmount(query)
  tasksAmount.value = res
}

async function delDateSelect() {
  activeDate.value = null
  await refreshTasks()
}

async function onDateSelect(date) {
  const clickedDate = dayjs(date).startOf("day"); // Преобразуем дату в объект dayjs с началом дня

  // Сравнение: если текущая дата совпадает с выбранной, сбрасываем
  activeDate.value && activeDate.value.isSame(clickedDate)
    ? (activeDate.value = null)
    : (activeDate.value = clickedDate) // Иначе устанавливаем новую дату

  await refreshTasks()
}

let prettyDate = computed(() => {
  return activeDate.value ? activeDate.value.format("DD:MM:YYYY") : ""
})

let moreTasks = async () => {
  page++
  let res = await refreshTasks()

  if (res.length == tasksLenght) {
    showMoreButton.value = false
  }
  tasksLenght = res.length
}
async function refreshTasks() {


  if (activeDate.value) {
    const startOfDay = activeDate.value.startOf("day").valueOf()
    const endOfDay = activeDate.value.endOf("day").valueOf()

    query.deadLine = {
      $gte: startOfDay + CURRENT_OFFSET, // Больше или равно началу дня
      $lte: endOfDay + CURRENT_OFFSET, // Меньше или равно концу дня
    }
  } else {
    delete query.deadLine
  }
  await taskStore.getAll(page, query)
  tasks.value = taskStore.tasks
  await getTasksAmount()
}

watch(search, (newSearch, oldSearch) => {
  if (newSearch.length > 2 || newSearch.length <= oldSearch.length) {
    localStorage.setItem("taskSearch", newSearch)
    query.$or[0].name.$regex = newSearch
    query.$or[1]['tripInfo.name'].$regex = newSearch
    refreshTasks()
  }
})

onMounted(async () => {

  if (localStorage.getItem("taskSearch")) {
    search.value = localStorage.getItem("taskSearch")
  }

  await refreshTasks()
  if (taskStore.tasks.length < 20) {
    showMoreButton.value = false
  }
  await getTasksAmount()
})
</script>
<template>
  <div>
    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; align-items: center" class="pa-8">
      <div >
        <a-button v-if="isCreator" class="btn_light ma-8" @click="router.push('/create-task')"> создать задачу </a-button>
      </div>

      <div>
        <span @click="isCalendarVisible = !isCalendarVisible" class="mdi mdi-calendar-range-outline"
          style="font-size: 24px; margin-right: 8px; cursor: pointer"></span>
        <a-input v-model:value="search" placeholder="поиск" style="width: 180px" allow-clear />
      </div>
    </div>
    <h3>
      {{ prettyDate ? `Задачи на ${prettyDate}` : "Все задачи" }}
      <sup v-if="activeDate" @click="delDateSelect()" class="mdi mdi-close"
        style="font-size: 16px; color: #fc4f06; cursor: pointer"></sup>
    </h3>
    <a-config-provider :locale="locale">
      <a-calendar :value="selectedDate" @select="onDateSelect" v-if="isCalendarVisible">
        <template #dateCellRender="{ current }">
          <div class="date-cell">
            <span v-if="getTasks(current).length > 0">
              {{ getTasks(current).length }}
            </span>
          </div>
        </template>
      </a-calendar>
    </a-config-provider>
    <a-row :gutter="[8, 8]">
      <a-col v-for="(task, index) in tasks" :span="24" :key="task._id">
        <TaskCard @refreshTasks="refreshTasks()" :task="task"> </TaskCard>
      </a-col>
      <a-col :span="24" class="justify-center d-flex" @click="moreTasks()" v-if="showMoreButton">
        <a-button>Ещё</a-button></a-col>
    </a-row>
  </div>
</template>
<style scoped>
/* Общий стиль ячеек */
.date-cell {
  text-align: center;

  color: #fc4f06;
  font-weight: bold;
}

.ant-picker-calendar-date-content {
  height: auto !important;
}
</style>
