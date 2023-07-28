<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from "vue-router";
import TripService from "../../service/TripService";
import { useTrips } from '../../stores/trips';
import { useAuth } from '../../stores/auth';

import dayjs from 'dayjs'

import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
const dateFormatList = ["DD.MM.YY", "DD.MM.YY"];
const ruLocale = locale;

let props = defineProps(['trip', 'actions'])
let emit = defineEmits(['deleteTrip'])
let { actions } = props
let trip = ref(props.trip)
let router = useRouter()
let tripStore = useTrips()
let userStore = useAuth()

let dates = ref([{ start: null, end: null }])

let addDateDialog = ref(false)

const clearData = (dataString) => {
    let date
    if (dataString.length == 13) {
        const dataFromString = new Date(Number(dataString));
        date = dataFromString

    } else {
        date = new Date(dataString)
    };
    return date.toLocaleDateString("ru-Ru", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",

    })
}
function editTrip(_id) {
    router.push(`/edit-trip?_id=${_id}`);
}

function copyTrip(_id) {
    router.push({ name: `CopyTrip`, query: { _id } });
}
async function hideTrip(_id) {
    trip.value.isHidden = !trip.value.isHidden;
    TripService.hideTrip(_id, trip.value.isHidden);
}
function goToTripPage(_id) {
    router.push(`/trip?_id=${_id}`);
}
async function tripToDelete(_id) {
    let response = await tripStore.deleteById(_id);
    if (response.status == 200) {
        emit('deleteTrip')
    }
}
function updateUser(_id) {
    userStore
        .updateUser({
            email: userStore.user.email,
            $push: { trips: _id },
        })
        .then((response) => {
            userStore.user = response.data;
        })
        .catch((err) => {
            console.log(err);
        });
}
async function submit() {
    let datesToSend = []

    for (let d of dates.value) {
        let toPush = { start: null, end: null, author: userStore.user._id }
        if (d.start && d.end) {
            let startDate = new Date(d.start.$d);
            startDate.setHours(0)
            startDate.setMinutes(0)
            startDate.setSeconds(0)
            startDate.setMilliseconds(0)

            toPush.start = Number(Date.parse(startDate.toString()));

            let endDate = new Date(d.end.$d);
            endDate.setHours(23)
            endDate.setMinutes(59)
            endDate.setSeconds(59)
            endDate.setMilliseconds(999)

            toPush.end = Date.parse(endDate);
        }

        if (toPush.start && toPush.end) {
            datesToSend.push(toPush)
        }
    }

    let res = await tripStore.createManyByDates(datesToSend, trip.value._id)

    for (let _id of res.data) {
        updateUser(_id)
    }

    if (res.status == 200) {
        addDateDialog.value = false
    }
}
let tripDuration = computed(() => {
    return Math.ceil((trip.value.end - trip.value.start) / (1000 * 60 * 60 * 24))
})
let showMessage = ref(false);

watch(dates, () => {
    for (let i = 0; i < dates.value.length; i++) {
        let date = dates.value[i]
        if (date.start && !date.end) {
            let s = new Date(dayjs(date.start).$d)
            s.setDate(s.getDate() + tripDuration.value - 1)

            date.end = dayjs(s)
        }
    }
}, { deep: true })
</script>
<template>
    <div v-if="trip._id">
        <a-card class="card" hoverable :class="[trip.isHidden ? 'overlay' : '']">
            <div style="text-align:center">
                {{ trip.name }}
            </div>
            <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
            <div>
                <span class="mdi mdi-compass-outline"></span>{{ trip.startLocation.name }}
            </div>
            <div>
                <span class="mdi mdi-calendar-arrow-right"></span>
                {{ `c ${clearData(trip.start)}` }}
                <span class="mdi mdi-calendar-arrow-left"></span>
                {{ `по ${clearData(trip.end)}` }}
            </div>

            <div class="actions d-flex justify-center">
                <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="tripToDelete(trip._id)"
                    v-if="(!trip.billsList?.length > 0) && actions.includes('delete')">
                    <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
                </a-popconfirm>
                <a-popconfirm v-if="actions.includes('edit') && !trip.parent" title="Вы уверены?" ok-text="Да"
                    cancel-text="Нет" @confirm="editTrip(trip._id)">
                    <span class="mdi mdi-pen" style="color: #245159; cursor: pointer"></span>
                </a-popconfirm>
                <a-popconfirm v-if="actions.includes('hide') && !trip.parent" title="Вы уверены?" ok-text="Да"
                    cancel-text="Нет" @confirm="hideTrip(trip._id)">
                    <span v-if="!trip.isHidden" class="mdi mdi-eye" style="color: #245159; cursor: pointer"></span>
                    <span v-else class="mdi mdi-eye-off" style="color: #245159; cursor: pointer"></span>
                </a-popconfirm>
                <span v-if="!trip.parent && actions.includes('addDate')" class="mdi mdi-plus-circle-outline"
                    style="color: #245159; cursor: pointer" @click="addDateDialog = true"></span>
                <a-popconfirm v-if="actions.includes('copy') && !trip.parent" title="Вы уверены?" ok-text="Да"
                    cancel-text="Нет" @confirm="copyTrip(trip._id)">
                    <span class="mdi mdi-content-copy" style="color: #245159; cursor: pointer"></span>
                </a-popconfirm>
                <span class="mdi mdi-information-outline"
                    @click="router.push({ path: 'customers-trip', query: { _id: trip._id } })"
                    v-if="actions.includes('info')"></span>
                <span class="mdi mdi-email-outline" v-if="trip.moderationMessage && actions.includes('msg') && !trip.parent"
                    @click="showMessage = !showMessage"></span>
            </div>
            <div v-if="showMessage">
                Замечания: {{ trip.moderationMessage }}
            </div>
        </a-card>
        <a-modal v-model:visible="addDateDialog" title="Добавить даты" okText="Отправить" cancelText="Отмена" @ok="submit">
            <a-row :gutter="[16, 16]" v-for="date of dates">
                <a-col :span="12">
                    Дата начала
                    <a-date-picker style="width: 100%" v-model:value="date.start" placeholder="Начало" :locale="ruLocale"
                        :format="dateFormatList" />
                </a-col>

                <a-col :span="12">
                    Дата конца
                    <a-date-picker style="width: 100%" v-model:value="date.end" placeholder="Конец" :locale="ruLocale"
                        :format="dateFormatList" />
                </a-col>
            </a-row>
            <a-button type="dashed" block @click="dates.push({ start: null, end: null })" class="mt-8 mb-8">
                добавить даты
            </a-button>
            <a-button type="dashed" block @click="dates.pop()" class="mt-8 mb-8" style="color: red">
                удалить даты
            </a-button>
        </a-modal>
    </div>
</template>
<style scoped lang="scss">
.actions {
    font-size: 20px;
    position: relative;

    * {
        margin: 4px;
        cursor: pointer;
    }
}



.overlay {

    opacity: 0.5;

}
</style>