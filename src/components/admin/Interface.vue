<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAppState } from '../../stores/appState';

let appStateStore = useAppState()
let tripType = ref('')

let sendTo = ref('')
let selectedEmailTypes = ref([])

let emailsFromDb = ref([])

async function addTripType() {
    let res = await appStateStore.addTripType(tripType.value)
    if (res.status == 200) {
        appStateStore.appState[0].tripType.push(tripType.value)
    }
}

async function addEmail() {
    if (selectedEmailTypes.value && sendTo.value.length) {
        let res = await appStateStore.addEmail(sendTo.value, selectedEmailTypes.value)
    }
}

async function changeEmailEvents(email, event, checked) {
    let updateQuery = { $push: {}, $pull: {} }
    if (checked) {
        updateQuery.$push['sendMailsTo.' + event] = email
    } else {
        updateQuery.$pull['sendMailsTo.' + event] = email
    }

    let res = await appStateStore.updateEmails(updateQuery)
}
function convertEmailsFromDbToRef() {
    for (let key of Object.keys(appStateStore.appState[0].sendMailsTo)) {
        for (let i = 0; i < appStateStore.appState[0].sendMailsTo[key].length; i++) {
            if (!emailsFromDb.value.find((element) => element.email == appStateStore.appState[0].sendMailsTo[key][i])) {
                emailsFromDb.value.push({ email: appStateStore.appState[0].sendMailsTo[key][i], checkboxes: [] })
            }
            for (let j = 0; j < emailsFromDb.value.length; j++) {
                if (emailsFromDb.value[j].email == appStateStore.appState[0].sendMailsTo[key][i]) {
                    emailsFromDb.value[j].checkboxes.push({ value: key, label: key, checked: true })
                }
            }
        }
    }
    for (let e of emailsFromDb.value) {
        for (let key of Object.keys(appStateStore.appState[0].sendMailsTo)) {
            if (!e.checkboxes.find((el) => el.value == key)) {
                e.checkboxes.push({ value: key, label: key, checked: false })
            }
        }
    }
}
onMounted(async () => {
    if (!appStateStore.appState) {
        await appStateStore.refreshState();
    }
    convertEmailsFromDbToRef()
})
</script>
<template>
    <a-row>
        <a-col :span="24">
            <a-row>
                <a-col :span="24">
                    <h3>Тип тура</h3>
                </a-col>
                <a-col :span="24" class="d-flex align-center">
                    <a-input placeholder="Пляжный" size="large" v-model:value="tripType"></a-input>
                    <a-button type="primary" class="ml-12 lets_go_btn" @click="addTripType">добавить</a-button>
                </a-col>
                <a-col v-for="t of appStateStore.appState[0].tripType" class="ma-8" style="cursor: pointer">
                    <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                        @confirm="() => { appStateStore.deleteTripType(t) }">
                        {{ t }}
                    </a-popconfirm>
                </a-col>
            </a-row>
            <a-row class="mt-8" :gutter="[16, 8]">
                <a-col :span="24">
                    <h3>email-уведомления</h3>
                </a-col>

                <a-col :span="24" class="d-flex align-center">
                    <a-input placeholder="email@gmail.com" size="large" v-model:value="sendTo"></a-input>
                </a-col>
                <a-col :span="24">
                    <a-select v-model:value="selectedEmailTypes" placeholder="Выберите когда отправлять"
                        :options="[{ label: 'Создание тура', value: 'CreateTrip' }, { label: 'Создание попутчика', value: 'CreateCompanion' }, { label: 'Заказ тура', value: 'BookingTrip' }]"
                        style="width: 100%" size="large" mode="tags">
                    </a-select>
                </a-col>
                <a-col :span="24" class="d-flex justify-center">
                    <a-button type="primary" class="ml-12 lets_go_btn" @click="addEmail">добавить</a-button>
                </a-col>
            </a-row>
            <a-row class="mt-16 d-flex" :gutter="[16, 16]">
                <a-col v-for="email of emailsFromDb">
                    <a-card class="pa-8">
                        <p>
                            {{ email.email }}
                        </p>
                        <div>
                            <a-checkbox v-for="ch of email.checkboxes" v-model:checked="ch.checked"
                                @change="changeEmailEvents(email.email, ch.value, ch.checked)">{{ ch.label
                                }}</a-checkbox>
                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>