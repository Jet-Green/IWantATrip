<script setup>
import { ref, onMounted, computed, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
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


const router = useRouter()
const route = useRoute()

const userStore = useAuth()
const taskStore = useTasks()

let isCreator = userStore.user.tinkoffContract || false
let showMoreButton = ref(true)
let tasks = ref([])
let tasksAmount = ref([])
let isCalendarVisible = ref(false)
let selectedStatus = ref("all")

let search = ref("")
let page = 1
let query = {
  $and: [
    {
      $or: [{ author: userStore.user._id }, { managers: userStore.user._id }],
    },
    {
      $or: [{ name: { $regex: "", $options: "i" } }, { "tripInfo.name": { $regex: "", $options: "i" } }],
    },
  ],
  $or: [
    {
      "tripInfo.end": {
        $gte: Date.now() ,
      }
    },
    {
      $and: [
        { trip: null },
        {
          deadLine: {
            $gte: Date.now()  - 14 * 24 * 60 * 60 * 1000, // minus 14 days 
          }
        }
      ]
    },
  ]
}


const selectedDate = ref(undefined)
const activeDate = ref(null)
const events = computed(() => {
  return tasksAmount.value.map((item) => ({
    date: dayjs(item.deadLine)
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


  let query = {
    $and: [
      { $or: [{ author: userStore.user._id }, { managers: userStore.user._id }], },
      {
        $or: [
          {
            "tripInfo.end": {
              $gte: Date.now(),
            }
          },
          {
            $and: [
              { trip: null },
              {
                deadLine: {
                  $gte: Date.now()  - 14 * 24 * 60 * 60 * 1000, // minus 14 days 
                }
              }
            ]
          },
        ]
      }
    ]


  }

  query.status = selectedStatus.value
  if (selectedStatus.value == "all") {
    delete query.status
  }
  let res = await taskStore.getTasksAmount(query)
  tasksAmount.value = res
}

async function delDateSelect() {
  activeDate.value = null
  await refreshTasks()
}

async function onDateSelect(date) {
  const clickedDate = dayjs(date).startOf("day") // Преобразуем дату в объект dayjs с началом дня

  // Сравнение: если текущая дата совпадает с выбранной, сбрасываем
  activeDate.value && activeDate.value.isSame(clickedDate)
    ? (activeDate.value = null)
    : (activeDate.value = clickedDate) // Иначе устанавливаем новую дату

  await refreshTasks()
}

let prettyDate = computed(() => {
  return activeDate.value ? activeDate.value.format("DD.MM.YYYY") : ""
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
  query.status = selectedStatus.value
  if (selectedStatus.value == "all") {
    delete query.status
  }

  if (activeDate.value) {
    const startOfDay = activeDate.value.startOf("day").valueOf()
    const endOfDay = activeDate.value.endOf("day").valueOf()

    query.deadLine = {
      $gte: startOfDay, // Больше или равно началу дня
      $lte: endOfDay, // Меньше или равно концу дня
    }
  } else {
    delete query.deadLine
  }
  await taskStore.getAll(page, query)
  tasks.value = taskStore.tasks
  await getTasksAmount()
}

watch(search, (newSearch, oldSearch) => {
  if (newSearch == "" && route.query.tripName) {
    query.$and.pop()
    router.push('/cabinet/tasks')
  }

  if (newSearch.length > 2 || newSearch.length <= oldSearch.length) {
    localStorage.setItem("taskSearch", newSearch)
    query.$and[1].$or[0].name.$regex = newSearch
    query.$and[1].$or[1]["tripInfo.name"].$regex = newSearch
    refreshTasks()
  }
})

watch(selectedStatus, async (newStatus) => {
  if (newStatus == '') return;
  await refreshTasks()
  localStorage.setItem('tasks.selectedStatus', selectedStatus.value)
})

onMounted(async () => {
  if (localStorage.getItem("taskSearch")) {
    search.value = localStorage.getItem("taskSearch")
  }

  if (localStorage.getItem("tasks.selectedStatus")) {
    selectedStatus.value = localStorage.getItem("tasks.selectedStatus");
  }
  if (route.query.tripName) {
    selectedStatus.value = 'all'
    search.value = route.query.tripName
    query.$and.push({ "tripInfo._id": route.query._id })

  }

  await refreshTasks()
  if (taskStore.tasks.length < 50) {
    showMoreButton.value = false
  }
  await getTasksAmount()


})
</script>
<template>
  <div style="margin-bottom: 72px;">
    <div
      style="display: flex; justify-content: space-between; flex-wrap: wrap; align-items: center; margin-bottom: 8px">
      <div>
        <a-button v-if="isCreator" class="btn_light ma-8" @click="router.push('/create-task')">
          создать задачу
        </a-button>
      </div>

      <div>
        <a-radio-group v-model:value="selectedStatus">
          <a-radio value="open">Новые</a-radio>
          <a-radio value="closed">Выполнено</a-radio>
          <a-radio value="all">Все</a-radio>
        </a-radio-group>
      </div>
      <div>
        <span @click="isCalendarVisible = !isCalendarVisible" class="mdi mdi-calendar-range-outline"
          style="font-size: 24px; margin-right: 8px; cursor: pointer"></span>
        <a-input v-model:value="search" placeholder="поиск" style="width: 180px" allow-clear />
      </div>
    </div>
    <h3>
      {{ prettyDate ? `Задачи на ${prettyDate}` : "Задачи" }}
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
