<script setup>
import { ref, computed, watch, toRefs, onMounted } from 'vue';
import { useRouter } from "vue-router";
import TripService from "../../service/TripService";
import { useTrips } from '../../stores/trips';
import { useAuth } from '../../stores/auth';
import { useBus } from '../../stores/bus'
import { useAppState } from '../../stores/appState';
import Bus from '../../components/Bus.vue'
import TaskStatusButton from '../_cabinet/crm/TaskStatusButton.vue';
import { useTasks } from "../../stores/tasks"

import dayjs from 'dayjs'

import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import { boolean } from 'yup';
const dateFormatList = ["DD.MM.YY", "DD.MM.YY"];
const ruLocale = locale;

let buses = ref([])
let selected_bus = ref()

let props = defineProps(['trip', 'actions'])
let emit = defineEmits(['deleteTrip', 'updateTrip'])
let { actions } = toRefs(props)
let { trip } = toRefs(props)
let router = useRouter()
let tripStore = useTrips()
let userStore = useAuth()
const taskStore = useTasks()
let appStateStore = useAppState()
let partner = ref(trip.value.partner ?? "")
let canSellPartnerTour = ref(boolean)
let dates = ref([{ start: null, end: null }])

const userTripCalc = ref([{ _id: '', name: 'пустой калькулятор' }, ...userStore.user?.tripCalc])
// console.log(userTripCalc.value);
let addDateDialog = ref(false)
let addPartnerDialog = ref(false)
let addLocationDialog = ref(false)
let updateTransportDialog = ref(false)
let editCommentDialog = ref(false)
let calculatorDialog = ref(false)
let addAdditionalServiceDialog = ref(false)
let possibleTransport = ref([])

let showMessage = ref(false);

let locationToSend = ref()
let locationsToDelete = ref([])

let locationSearchRequest = ref('')
let possibleLocations = ref([])

let submitCount = ref(0)
let transportToDelete = ref([])
let addTransportForm = ref({
    transportType: null,
    capacity: null,
    waiting: null,
    // price: null
})
let userComment = ref('')
let tripCalculator = ref(trip.value.calculator ? { _id: trip.value.calculator._id, name: trip.value.calculator.name } : { _id: '', name: 'пустой калькулятор' })

let checked = ref(false)

let additionalService = ref({
    name: '',
    price: 0
})

let tasks = ref([])

// let page = 1
// let query = {
//     $and: [
//         {
//             $or: [{ author: userStore.user._id }, { managers: userStore.user._id }],
//         },
//         {
//             $or: [{ name: { $regex: trip?.value.name, $options: "i" } }, { "tripInfo.name": { $regex: trip?.value.name, $options: "i" } }],
//         },
//     ],
//     $or: [
//         {
//             "tripInfo.end": {
//                 $gte: Date.now() + new Date().getTimezoneOffset() * 60 * 1000,
//             }
//         },
//         {
//             $and: [
//                 { trip: null },
//                 {
//                     deadLine: {
//                         $gte: Date.now() + new Date().getTimezoneOffset() * 60 * 1000 - 7 * 24 * 60 * 60 * 1000, // minus 7 days 
//                     }
//                 }
//             ]
//         },
//     ]
// }


const clearData = (dataString) => {
    let timezoneOffset = trip.value?.timezoneOffset ? trip.value?.timezoneOffset : trip.value?.parent.timezoneOffset
    dataString = dataString - timezoneOffset
    const date = new Date(dataString);
    if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("ru-RU", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            timeZone: 'UTC' // Используем UTC для гарантии, что время будет в формате UTC
        });
    }

    return '';
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
        emit('updateTrip')
    }
}
async function setUserComment(_id) {
    let response = await tripStore.setUserComment(_id, userComment.value)
    if (response.status == 200) {
        emit('updateTrip')
        editCommentDialog.value = false
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

function startDate(date) {
    let dateNow = new Date(date);
    dateNow.setHours(0)
    dateNow.setMinutes(0)
    dateNow.setSeconds(0)
    dateNow.setMilliseconds(0)
    return dateNow
}
function endDate(date) {
    let dateNow = new Date(date);
    dateNow.setHours(23)
    dateNow.setMinutes(59)
    dateNow.setSeconds(59)
    dateNow.setMilliseconds(999)
    return dateNow
}

async function submit() {
    let datesToSend = []

    for (let d of dates.value) {

        let toPush = { start: null, end: null, author: userStore.user._id }
        if (d.start && d.end) {
            let startData = startDate(d.start.$d);
            let endData = endDate(d.end.$d);
            toPush.start = Number(Date.parse(startData.toString()));
            toPush.end = Date.parse(endData);
        }

        if (toPush.start && toPush.end) {
            datesToSend.push(toPush)
        }
    }
    let res = await tripStore.createManyByDates(datesToSend, trip.value._id)

    for (let _id of res.data) {
        await updateUser(_id)
    }
    if (res.status == 200) {
        emit('updateTrip')
        addDateDialog.value = false
    }
}
async function addPartner() {
    tripStore.updatePartner(partner.value, trip.value._id, canSellPartnerTour.value,)
        .then(() => { addPartnerDialog.value = false; emit('updateTrip') })
        .catch(error => console.log(error))
}

let tripDuration = computed(() => {
    return Math.ceil((trip.value.end - trip.value.start) / (1000 * 60 * 60 * 24))
})

function selectStartLocation(selected) {
    for (let l of possibleLocations.value) {
        if (l.value == selected) {
            locationToSend.value = l.location
        }
    }
}

function addToDeleteLocations(_id) {
    for (let i = 0; i < locationsToDelete.value.length; i++) {
        if (locationsToDelete.value[i] == _id) {
            locationsToDelete.value.splice(i, 1)
            return
        }
    }
    locationsToDelete.value.push(_id)
}

async function updateIncludedLocations() {
    if (submitCount.value > 0) {
        return
    }
    submitCount.value++;

    let res = await tripStore.updateIncludedLocations({ newLocation: locationToSend.value, locationsToDelete: locationsToDelete.value, tripId: trip.value._id })
    if (res.status == 200) {
        addLocationDialog.value = false
        emit('updateTrip')
    }
}


async function updateTrasports() {
    let isEmptyNewTransport = false;
    for (let key of Object.keys(addTransportForm.value)) {
        if (!addTransportForm.value[key]) isEmptyNewTransport = true
    }

    let res = await tripStore.updateTransports({ tripId: trip.value._id, newTransport: isEmptyNewTransport ? null : addTransportForm.value, transportToDelete: transportToDelete.value })
    if (res.status == 200) {
        updateTransportDialog.value = false
        emit('updateTrip')
    }
}

function addToDeleteTransports(name) {
    for (let i = 0; i < transportToDelete.value.length; i++) {
        if (transportToDelete.value[i].name == name) {
            return transportToDelete.value.splice(i, 1)
        }
    }
    transportToDelete.value.push(name)
}

async function moveToCatalog(_id) {
    await tripStore.moveToCatalog(_id)
}

async function setTripCalculator() {
    if (tripCalculator.value == '' && !trip.value.calculator) {
        return calculatorDialog.value = false
    }
    if (tripCalculator.value == trip.value.calculator?._id) {
        return calculatorDialog.value = false
    }
    let res = await userStore.setTripCalculator(tripCalculator.value, trip.value._id);
    if (res.status == 200) {
        emit('updateTrip')
        calculatorDialog.value = false
    }
}

function goToTripCalc() {
    localStorage.setItem("tripCalcPreview", JSON.stringify(trip.value.calculator));
    router.push('/calc')
}

async function addAdditionalService() {
    let res = await tripStore.addAdditionalService(trip.value._id, additionalService.value)

    if (res.status == 200) {
        emit('updateTrip')
        addAdditionalServiceDialog.value = false
    }
}

async function deleteAdditionalService(serviceId) {
    let res = await tripStore.deleteAdditionalService(trip.value._id, serviceId)
    if (res.status == 200) {
        emit('updateTrip')
    }
}



watch(locationSearchRequest, async (newValue, oldValue) => {
    if (newValue.trim().length > 2 && newValue.length > oldValue.length) {
        var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

        var options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + import.meta.env.VITE_DADATA_TOKEN
            },
            body: JSON.stringify({
                query: newValue,
                count: 5,
                "from_bound": { "value": "city" },
                "to_bound": { "value": "settlement" }
            })
        }

        let res = await fetch(url, options)
        try {
            let suggestions = JSON.parse(await res.text()).suggestions
            possibleLocations.value = []
            for (let s of suggestions) {
                let location = {
                    value: s.value,
                    location: {
                        name: s.value,
                        shortName: '',
                        type: 'Point',
                        coordinates: [
                            s.data.geo_lon,
                            s.data.geo_lat
                        ]
                    }
                }

                if (s.data.settlement) {
                    location.location.shortName = s.data.settlement
                }
                else if (s.data.city) {
                    location.location.shortName = s.data.city
                } else {
                    location.location.shortName = s.value
                }

                possibleLocations.value.push(location)
            }
        } catch (error) {
            console.log(error);
        }
    }
})

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



onMounted(async () => {

    canSellPartnerTour.value = trip.value.canSellPartnerTour ?? false
    checked.value = trip.value.isCatalog
    if (!appStateStore.appState[0]?.transport) {
        await appStateStore.refreshState()
    }
    for (let t of appStateStore.appState[0].transport) {
        possibleTransport.value.push({ value: t.name })
    }
    buses.value = await useBus().get()



})
</script>
<template>
    <div v-if="trip._id">
        <a-card class="card" hoverable :class="[trip.isHidden ? 'overlay' : '']">
            <div class="d-flex">
                <div style="width:100%;text-align:center;">{{ trip.name }}</div>

                <span class="mdi mdi-calculator"
                    style="cursor: pointer; margin-right: 8px; font-size: 20px; color: #245159;"
                    @click="calculatorDialog = !calculatorDialog"></span>
                <a-popconfirm title="В каталог?" ok-text="Да" cancel-text="Нет" @confirm="moveToCatalog(trip._id)">
                    <span class="mdi mdi-send" style="cursor: pointer; font-size: 20px; color: #245159;"></span>
                </a-popconfirm>
            </div>
            <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
            <div v-if="trip.partner">
                <span class="mdi mdi-human-handsup"> </span>{{ trip.partner }}
            </div>
            <div v-if="trip?.startLocation?.name">
                <span class="mdi mdi-compass-outline"> </span>{{ trip.startLocation.name }}
            </div>
            <div>
                <span class="mdi mdi-calendar-arrow-right"></span>
                {{ `c ${clearData(trip.start)}` }}
                <span class="mdi mdi-calendar-arrow-left"></span>
                {{ `по ${clearData(trip.end)}` }}
            </div>
        
            <TaskStatusButton :trip="trip" />
            <div class="actions d-flex justify-center">
                <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="tripToDelete(trip._id)"
                    v-if="(!trip.billsList?.length > 0) && actions.includes('delete')">
                    <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
                </a-popconfirm>
                <a-popconfirm v-if="actions.includes('edit') && !trip.parent" title="Вы уверены?" ok-text="Да"
                    cancel-text="Нет" @confirm="editTrip(trip._id)">
                    <span class="mdi mdi-pencil" style="cursor: pointer"></span>
                </a-popconfirm>
                <a-popconfirm v-if="actions.includes('hide') && !trip.parent" title="Вы уверены?" ok-text="Да"
                    cancel-text="Нет" @confirm="hideTrip(trip._id)">
                    <span v-if="!trip.isHidden" class="mdi mdi-eye-outline" style="cursor: pointer"></span>
                    <span v-else class="mdi mdi-eye-off-outline" style="cursor: pointer"></span>
                </a-popconfirm>
                <span v-if="!trip.parent && actions.includes('addDate')" class="mdi mdi-plus-circle-outline"
                    style="cursor: pointer" @click="addDateDialog = true"></span>
                <!-- <a-popconfirm v-if="actions.includes('copy') && !trip.parent" title="Вы уверены?" ok-text="Да"
                    cancel-text="Нет" @confirm="copyTrip(trip._id)">
                    <span class="mdi mdi-content-copy" style="cursor: pointer"></span>
                </a-popconfirm> -->
                <span class="mdi mdi-information-outline"
                    @click="router.push({ path: '/cabinet/customers-trip', query: { _id: trip._id } })"
                    v-if="actions.includes('info')"></span>

                <span v-if="!trip.parent" class="mdi mdi-human-handsup" @click="addPartnerDialog = true">
                </span>
                <span v-if="!trip.parent && actions.includes('transports')" class="mdi mdi-car-estate"
                    @click="updateTransportDialog = true">
                </span>
                <span class="mdi mdi-map-marker-plus-outline" style="cursor: pointer"
                    v-if="actions.includes('addLocation') && !trip.parent" @click="addLocationDialog = true"></span>
                <span class="mdi mdi-email-outline"
                    v-if="trip.moderationMessage && actions.includes('msg') && !trip.parent"
                    @click="showMessage = !showMessage"></span>
                <span v-if="actions.includes('editComment') && !trip.parent" class="mdi mdi-comment-edit-outline"
                    @click="editCommentDialog = !editCommentDialog; userComment = trip.userComment"></span>
                <span v-if="actions.includes('addAdditionalService') && !trip.parent" class="mdi mdi-cash-plus"
                    @click="addAdditionalServiceDialog = !addAdditionalServiceDialog;"></span>
            </div>
            <div v-if="showMessage">
                Замечания: {{ trip.moderationMessage }}
            </div>
        </a-card>
        <a-modal v-model:open="calculatorDialog" title="Привязанный калькулятор" okText="Отправить" cancelText="Отмена"
            @ok="setTripCalculator">

            <a-col :span="24">
                <div v-if="trip.calculator" class="mb-16">
                    <span class="calc-href" @click="goToTripCalc">
                        {{ trip.calculator.name }}
                    </span>
                </div>

                Новый калькулятор
                <a-select v-model:value="tripCalculator" :options="userTripCalc"
                    :fieldNames="{ label: 'name', value: '_id' }" style="width: 100%"
                    placeholder="Название калькулятора">
                    <template #option="calc">
                        <span v-if="calc._id">
                            {{ calc.name }}
                        </span>
                        <span v-else style="color: #ff6600;">
                            {{ calc.name }}
                        </span>
                    </template>
                </a-select>
            </a-col>
        </a-modal>
        <a-modal v-model:open="editCommentDialog" title="Изменить комментарий" okText="Отправить" cancelText="Отмена"
            @ok="setUserComment(trip._id)">
            <a-row>
                <a-col :span="24">
                    <a-textarea placeholder="Крутой тур" v-model:value="userComment"
                        style="min-height: 120px;"></a-textarea>
                </a-col>
            </a-row>
        </a-modal>
        <a-modal v-model:open="addDateDialog" title="Добавить даты" okText="Отправить" cancelText="Отмена" @ok="submit">
            <a-row :gutter="[16, 16]" v-for="date of dates" :key="date.index">
                <a-col :span="12">
                    Дата начала
                    <a-date-picker style="width: 100%" v-model:value="date.start" placeholder="Начало"
                        :locale="ruLocale" :format="dateFormatList" />
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
        <a-modal v-model:open="addPartnerDialog" title="Добавить партнера" okText="Отправить" cancelText="Отмена"
            @ok="addPartner">

            <a-col :span="24">
                Название
                <a-input placeholder="ООО Ласточка" v-model:value="partner"></a-input>

            </a-col>
            <a-col :span="24">
                Принимать оплату в приложении?
                <div class="d-flex align-center justify-center" style="height:100%">
                    <a-checkbox v-model:checked="canSellPartnerTour">{{ canSellPartnerTour ? "ДА" : "НЕТ"
                        }}</a-checkbox>
                </div>

            </a-col>
        </a-modal>
        <a-modal v-model:open="addLocationDialog" title="Изменить локации" okText="Отправить" cancelText="Отмена"
            @ok="updateIncludedLocations">
            <a-col :span="24">
                <a-auto-complete v-model:value="locationSearchRequest" size="large" style="width: 100%" class="mt-8"
                    :options="possibleLocations" placeholder="Город/поселок"
                    @select="selectStartLocation"></a-auto-complete>

                <span v-for="(loc, index) of trip.locationNames" :key='index'>
                    <a-popconfirm :disabled="index == 0" @confirm="addToDeleteLocations(loc._id)"
                        :title="locationsToDelete.includes(loc._id) ? 'Не удалять?' : 'Удалить?'" ok-text="Да"
                        cancel-text="Нет" class="mt-8">
                        <a-tag :color="locationsToDelete.includes(loc._id) ? 'red' : ''"
                            style="cursor: pointer; padding: 2px 6px 2px 6px; border-radius: 6px;">
                            {{ loc.shortName ?? loc.name }}
                        </a-tag>
                    </a-popconfirm>
                </span>
            </a-col>
        </a-modal>
        <a-modal v-model:open="updateTransportDialog" title="Изменить транспорт" okText="Отправить" cancelText="Отмена"
            @ok="updateTrasports">
            <a-row :gutter="[16, 16]">
                <a-col :span="24" :md="24">
                    <a-select v-model="selected_bus" @select="bus => {
                        bus = JSON.parse(bus);
                        addTransportForm.transportType = { name: bus.name, bus_id: bus._id };
                        addTransportForm.capacity = bus.seats.length - bus.stuff.length;
                    }" style="width: 100%" placeholder="Выбрать автобус" option-label-prop="label">
                        <a-select-option v-for="bus in buses" :key="bus.index" :value="JSON.stringify(bus)"
                            :label="`${bus.name} (${bus.author}) — ${bus.seats.length} мест`">
                            <div style="display: flex; flex-direction: row; gap: 10px">
                                <Bus :bus="bus" preview style="width: max(4cqw, 90px);" />

                                <div style="line-height: 1.45;">
                                    <div>Название: {{ bus.name }}</div>
                                    <div>Автор: {{ bus.author }}</div>
                                    <div>Всего мест: {{ bus.seats.length }}</div>
                                    <div>Служ. мест: {{ bus.stuff.length }}</div>
                                </div>
                            </div>
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="24" :md="12">
                    Лист ожидания до, чел
                    <a-input-number :max="trip.maxPeople" :min="0" style="width: 100%"
                        v-model:value="addTransportForm.waiting"></a-input-number>
                </a-col>
                <a-col :span="24" :md="12">
                    Вместимость, чел
                    <a-input-number :max="trip.maxPeople" :min="1" style="width: 100%"
                        v-model:value="addTransportForm.capacity"></a-input-number>
                </a-col>
            </a-row>



            <span v-for="(transport) of trip.transports" :key="transport.index">
                <a-popconfirm @confirm="addToDeleteTransports(transport.transportType.name)"
                    :title="transportToDelete.includes(transport.transportType.name) ? 'Не удалять?' : 'Удалить?'"
                    ok-text="Да" cancel-text="Нет" class="mt-8">
                    <a-tag :color="transportToDelete.includes(transport.transportType.name) ? 'red' : ''"
                        style="cursor: pointer; padding: 2px 6px 2px 6px; border-radius: 6px;">
                        {{ transport.transportType.name }} {{ transport.waiting }}-{{ transport.capacity }} чел.
                    </a-tag>
                </a-popconfirm>
            </span>
        </a-modal>
        <a-modal v-model:open="addAdditionalServiceDialog" title="Дополнительный услуги" okText="Отправить"
            cancelText="Отмена" @ok="addAdditionalService">

            <a-row v-for="service of trip.additionalServices" :key="service.index" :gutter="[16, 16]">
                <a-col :span="18">
                    <b style="font-size: 16px;">
                        {{ service.name }}
                    </b>
                </a-col>
                <a-col :span="6" class="d-flex align-center" style="justify-content: end;">
                    {{ service.price }}₽
                    <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет"
                        @confirm="deleteAdditionalService(service._id)">
                        <span class="mdi mdi-delete"
                            style="cursor: pointer; color: #ff6600; font-size: 20px; margin: 4px;"></span>
                    </a-popconfirm>
                </a-col>
            </a-row>
            <hr v-if="trip.additionalServices?.length > 0">
            <a-row :gutter="[16, 16]">
                <a-col :span="24">
                    Название
                    <a-input placeholder="Прогулка по ферме" v-model:value="additionalService.name"></a-input>
                </a-col>
                <a-col :span="24">
                    Цена
                    <a-input-number prefix="₽" v-model:value="additionalService.price"
                        style="width: 100%;"></a-input-number>
                </a-col>
            </a-row>
        </a-modal>
    </div>
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

.calc-href {
    cursor: pointer;
    color: #ff6600;
    text-decoration: underline;
}


.overlay {

    opacity: 0.5;

}

.open-status {
    background: #ff6600;
}

.closed-status {
    background: #AEBC58;
}
</style>