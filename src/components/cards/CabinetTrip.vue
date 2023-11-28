<script setup>
import { ref, computed, watch, toRefs, onMounted } from 'vue';
import { useRouter } from "vue-router";
import TripService from "../../service/TripService";
import { useTrips } from '../../stores/trips';
import { useAuth } from '../../stores/auth';
import { useAppState } from '../../stores/appState';

import dayjs from 'dayjs'

import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
const dateFormatList = ["DD.MM.YY", "DD.MM.YY"];
const ruLocale = locale;

let props = defineProps(['trip', 'actions'])
let emit = defineEmits(['deleteTrip', 'updateTrip'])
let { actions } = toRefs(props)
let { trip } = toRefs(props)
let router = useRouter()
let tripStore = useTrips()
let userStore = useAuth()
let appStateStore = useAppState()
let partner = ref(trip.value.partner ?? '')
let dates = ref([{ start: null, end: null }])

let addDateDialog = ref(false)
let addPartnerDialog = ref(false)
let addLocationDialog = ref(false)
let updateTransportDialog = ref(false)
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

const clearData = (dataString) => {
    let date = 0
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
        emit('updateTrip')
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
    tripStore.updatePartner(partner.value, trip.value._id)
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
    if (!appStateStore.appState[0]?.transport) {
        await appStateStore.refreshState()
    }
    for (let t of appStateStore.appState[0].transport) {
        possibleTransport.value.push({ value: t.name })
    }
     // addTransportForm.value.price = trip.value.transports[0]?.price ?? null
})
</script>
<template>
    <div v-if="trip._id">
        <a-card class="card" hoverable :class="[trip.isHidden ? 'overlay' : '']">
            <div style="text-align:center">
                {{ trip.name }}

            </div>
            <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
            <div v-if="trip.partner">
                <span class="mdi mdi-human-handsup"> </span>{{ trip.partner }}
            </div>
            <div>
                <span class="mdi mdi-compass-outline"> </span>{{ trip.startLocation.name }}
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
                    <span class="mdi mdi-pen" style="cursor: pointer"></span>
                </a-popconfirm>
                <a-popconfirm v-if="actions.includes('hide') && !trip.parent" title="Вы уверены?" ok-text="Да"
                    cancel-text="Нет" @confirm="hideTrip(trip._id)">
                    <span v-if="!trip.isHidden" class="mdi mdi-eye" style="cursor: pointer"></span>
                    <span v-else class="mdi mdi-eye-off" style="cursor: pointer"></span>
                </a-popconfirm>
                <span v-if="!trip.parent && actions.includes('addDate')" class="mdi mdi-plus-circle-outline"
                    style="cursor: pointer" @click="addDateDialog = true"></span>
                <a-popconfirm v-if="actions.includes('copy') && !trip.parent" title="Вы уверены?" ok-text="Да"
                    cancel-text="Нет" @confirm="copyTrip(trip._id)">
                    <span class="mdi mdi-content-copy" style="cursor: pointer"></span>
                </a-popconfirm>
                <span class="mdi mdi-information-outline"
                    @click="router.push({ path: '/cabinet/customers-trip', query: { _id: trip._id } })"
                    v-if="actions.includes('info')"></span>

                <span v-if="!trip.parent" class="mdi mdi-human-handsup" @click="addPartnerDialog = true">
                </span>
                <span v-if="!trip.parent && actions.includes('transports')" class="mdi mdi-car-estate"
                    @click="updateTransportDialog = true">
                </span>
                <span class="mdi mdi-map-marker-plus" style="cursor: pointer"
                    v-if="actions.includes('addLocation') && !trip.parent" @click="addLocationDialog = true"></span>
                <span class="mdi mdi-email-outline" v-if="trip.moderationMessage && actions.includes('msg') && !trip.parent"
                    @click="showMessage = !showMessage"></span>
            </div>
            <div v-if="showMessage">
                Замечания: {{ trip.moderationMessage }}
            </div>
        </a-card>
        <a-modal v-model:open="addDateDialog" title="Добавить даты" okText="Отправить" cancelText="Отмена" @ok="submit">
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
        <a-modal v-model:open="addPartnerDialog" title="Добавить партнера" okText="Отправить" cancelText="Отмена"
            @ok="addPartner">

            <a-col :span="24">
                Название
                <a-input placeholder="ООО Ласточка" v-model:value="partner"></a-input>

            </a-col>
        </a-modal>
        <a-modal v-model:open="addLocationDialog" title="Изменить локации" okText="Отправить" cancelText="Отмена"
            @ok="updateIncludedLocations">
            <a-col :span="24">
                <a-auto-complete v-model:value="locationSearchRequest" size="large" style="width: 100%" class="mt-8"
                    :options="possibleLocations" placeholder="Город/поселок"
                    @select="selectStartLocation"></a-auto-complete>

                <span v-for="(loc, index) of trip.locationNames">
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
                    Тип
                    <a-auto-complete style="width: 100%" :options="possibleTransport" placeholder="Минивен"
                        @select="(value) => { addTransportForm.transportType = { name: value } }"></a-auto-complete>
                </a-col>
                <!-- <a-col :span="24" :md="12">
                    Цена для ожидающих
                    <a-input-number :min="1" style="width: 100%" v-model:value="addTransportForm.price"></a-input-number>
                </a-col> -->
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



            <span v-for="(transport) of trip.transports">
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



.overlay {

    opacity: 0.5;

}
</style>