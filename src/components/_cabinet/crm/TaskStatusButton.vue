<script setup>
import { ref, computed, watch, toRefs, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { useTasks } from "../../../stores/tasks"
import { useAuth } from '../../../stores/auth';
let props = defineProps(['trip'])
let { trip } = toRefs(props)

let router = useRouter()
const taskStore = useTasks()
const userStore = useAuth()
let tasks = ref([])

let query = {
    $and: [
        {
            $or: [{ author: userStore.user._id }, { managers: userStore.user._id }],
        },
        {
            $or: [{ name: { $regex: trip?.value.name, $options: "i" } }, { "tripInfo.name": { $regex: trip?.value.name, $options: "i" } }],
        },
    ],
    $or: [
        {
            "tripInfo.end": {
                $gte: Date.now() + new Date().getTimezoneOffset() * 60 * 1000,
            }
        },
        {
            $and: [
                { trip: null },
                {
                    deadLine: {
                        $gte: Date.now() + new Date().getTimezoneOffset() * 60 * 1000 - 7 * 24 * 60 * 60 * 1000, // minus 7 days 
                    }
                }
            ]
        },
    ]
}
const tasksStatus = computed(() => {
    const statusCount = { open: 0, closed: 0 };
    tasks.value.forEach((task) => {
        if (task.status in statusCount) {
            statusCount[task.status]++;
        }
    });
    return statusCount;
});
const taskClass = computed(() => {
    if (!(tasks.value.length)) {
        return ''
    }
    return tasksStatus.value.closed != tasks?.value.length ? 'open-status' : 'closed-status';
});

let fetchTasks = async () => {
    await taskStore.getAll(query).then((data) => { data? tasks.value = data: tasks.value =[] })
    await taskStore.getTripTasks(query).then((data) => { data? tasks.value = data: tasks.value =[] })
}
const goToTasks = () => {
    router.push({
        path: '/cabinet/tasks',
        query: { tripName: trip.value.name, _id: trip.value._id }, // передаем trip.value.name как query параметр
    })
}
onMounted(async () => {
    await fetchTasks()
})
</script>

<template>
    <div class="d-flex justify-end">
        <a-button size='small' shape="round" @click="goToTasks()" :class="taskClass">
            <span class="mdi mdi-calendar-check-outline"> </span>
            {{ tasksStatus.closed }}/{{ tasks.length }}</a-button>
    </div>
</template>

<style scoped>
.open-status {
    background: #ff6600;
}

.closed-status {
    background: #AEBC58;
}
</style>