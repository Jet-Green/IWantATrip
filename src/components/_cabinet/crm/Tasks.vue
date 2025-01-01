<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useAuth } from "../../../stores/auth";
import { useTasks } from "../../../stores/tasks";
import TaskCard from './TaskCard.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';
import ruRU from 'ant-design-vue/es/locale/ru_RU';

dayjs.extend(localeData);
dayjs.extend(updateLocale);

// Устанавливаем русский язык как основной
dayjs.locale('ru');
const locale = ruRU;

const router = useRouter()

const userStore = useAuth();
const taskStore = useTasks()

let showMoreButton = ref(true)
let tasks = ref([])
let isCalendarVisible = ref(false)

let search = ref('')
let page = 1
let query = {
  author: userStore.user._id,
  $or: [
    { name: { $regex: '', $options: 'i' } },
    // { category: { $regex: '', $options: 'i' } }
  ]
};

const selectedDate = ref(dayjs().startOf('day'));
const events = ref([
  { date: dayjs().startOf('day').valueOf(), title: 'Событие 1' },
  { date: dayjs().startOf('day').valueOf(), title: 'Событие 2' },
  { date: dayjs().add(1, 'day').startOf('day').valueOf(), title: 'Событие 3' },
  { date: dayjs().add(3, 'day').startOf('day').valueOf(), title: 'Событие 3' },
]);


function getEvents(currentDate) {
  return events.value.filter((event) =>
    dayjs(event.date).isSame(currentDate, 'day')
  );
}



function onDateSelect(date) {
  const clickedDate = dayjs(date).startOf('day'); // Преобразуем дату в объект dayjs с началом дня

  // Сравнение: если текущая дата совпадает с выбранной, сбрасываем
  selectedDate.value && selectedDate.value.isSame(clickedDate)
    ? (selectedDate.value = null)
    : (selectedDate.value = clickedDate); // Иначе устанавливаем новую дату
    isCalendarVisible.value =  false
}

let prettyDate = computed(
  () => {
    return selectedDate.value ? selectedDate.value.format('DD:MM:YYYY') : ''

  }
)


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
    localStorage.setItem('taskSearch', newSearch)
    query.$or[0].name.$regex = newSearch
    // query.$or[1].category.$regex = newSearch
    refreshTasks()
  }
})

onMounted(async () => {
  if (localStorage.getItem('taskSearch')) {
    search.value = localStorage.getItem('taskSearch')
  }

  await refreshTasks()
  if (taskStore.tasks.length < 20) {
    showMoreButton.value = false
  }
})
</script>
<template>
  <div>

    <div style="display: flex; justify-content:space-between;  flex-wrap:wrap; align-items:center" class="pa-8">
      <div>
        <a-button class="btn_light ma-8" @click="router.push('/create-task')">
          создать задачу
        </a-button>
      </div>

      <div>
        <span @click="isCalendarVisible = !isCalendarVisible" class="mdi mdi-calendar-range-outline"
          style="font-size: 24px; margin-right: 8px; cursor: pointer;"></span>
        <a-input v-model:value="search" placeholder="поиск" style="width:180px" allow-clear />
      </div>

    </div>
    <h3> {{ prettyDate ? `Задачи на ${prettyDate}` : 'Все задачи' }}</h3>
    <a-config-provider :locale="locale">
    <a-calendar :value="selectedDate" @select="onDateSelect" v-if="isCalendarVisible">
      <template #dateCellRender="{ current }">
        <div class="date-cell">
          <span v-if="getEvents(current).length > 0">
            {{ getEvents(current).length }}
          </span>
        </div>
      </template>
    </a-calendar>
    </a-config-provider>

    <a-row :gutter="[8, 8]">
      <a-col v-for="task in tasks" :span="24">

        <TaskCard @refreshTasks="refreshTasks()" :task="task">
        </TaskCard>

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

  color: #ff4d4f;
  font-weight: bold;

}

.ant-picker-calendar-date-content {
  height: auto !important;
}
</style>