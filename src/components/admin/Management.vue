<script setup>
import { ref, watch, onMounted, reactive } from 'vue'
import { useAdmin } from '../../stores/admin'
import UserCard from "./UserCard.vue"


let adminStore = useAdmin()

let query = ref('')
let userRole = ref('user')

let emailCreateTrip = ref('')
let emailBookingTrip = ref('')
let emailCreateCompanion = ref('')
let emailBuyTrip = ref('')
let emailCreateExcurtion = ref('')

let createTripEmails = ref([])
let bookingTripEmails = ref([])
let createCompanionEmails = ref([])
let createExcurtionEmails = ref([])
let buyTripEmails = ref([])

// notifications
let bookingTripNotifications = ref([])

let users = ref([])

async function addEmail(event, email) {
    email = email.trim()
    if (email.length > 2) {
        let res = await adminStore.addEmail(event, email)

        if (res.status == 200) {
            switch (event) {
                case 'CreateTrip':
                    createTripEmails.value.push(email)
                    break
                case 'BookingTrip':
                    bookingTripEmails.value.push(email)
                    break
                case 'CreateCompanion':
                    createCompanionEmails.value.push(email)
                    break
                case 'CreateExcurtion':
                    createExcurtionEmails.value.push(email)
                    break
                case 'BuyTrip':
                    buyTripEmails.value.push(email)
                    break
            }
        }
    }
}
let cabinetNotifications = reactive({
    bookingTrip: ''
})
async function addCabinetNotifications(event, email) {
    email = email.trim()
    if (email.length > 2) {
        let res = await adminStore.addCabinetNotifications(event, email)

        // await getNotifications('BookingTrip')
    }
}


async function getEmails(event) {
    let res = await adminStore.getEmails(event)
    let emails = res.data.sendMailsTo[0].emails

    switch (event) {
        case 'CreateTrip':
            createTripEmails.value = emails
            break
        case 'BookingTrip':
            bookingTripEmails.value = emails
            break
        case 'CreateCompanion':
            createCompanionEmails.value = emails
            break
        case 'CreateExcurtion':
            createExcurtionEmails.value = emails
            break
        case 'BuyTrip':
            buyTripEmails.value = emails
            break
    }
}

async function deleteEmail(event, email) {
    let res = await adminStore.deleteEmail(event, email)

    if (res.status == 200) {
        switch (event) {
            case 'CreateTrip':
                for (let i = 0; i < createTripEmails.value.length; i++) {
                    if (createTripEmails.value[i] == email) {
                        createTripEmails.value.splice(i, 1)
                    }
                }
                break
            case 'BookingTrip':
                for (let i = 0; i < bookingTripEmails.value.length; i++) {
                    if (bookingTripEmails.value[i] == email) {
                        bookingTripEmails.value.splice(i, 1)
                    }
                }
                break
            case 'CreateCompanion':
                for (let i = 0; i < createCompanionEmails.value.length; i++) {
                    if (createCompanionEmails.value[i] == email) {
                        createCompanionEmails.value.splice(i, 1)
                    }
                }
                break
            case 'CreateExcurtion':
                for (let i = 0; i < createExcurtionEmails.value.length; i++) {
                    if (createExcurtionEmails.value[i] == email) {
                        createExcurtionEmails.value.splice(i, 1)
                    }
                }
                break
                
            case 'BuyTrip':
                for (let i = 0; i < buyTripEmails.value.length; i++) {
                    if (buyTripEmails.value[i] == email) {
                        buyTripEmails.value.splice(i, 1)
                    }
                }
                break
        }
    }
}

watch([query, userRole], async ([newQuery, newUserRole]) => {
    let queryToDb = {}

    queryToDb.role = newUserRole
    queryToDb.query = newQuery.trim()

    let res = await adminStore.fetchUsers(queryToDb)
    users.value = res.data
})
onMounted(async () => {
    let res = await adminStore.fetchUsers()
    users.value = res.data

    await getEmails('CreateTrip')
    await getEmails('BookingTrip')
    await getEmails('CreateCompanion')
    await getEmails('CreateExcurtion')
    await getEmails('BuyTrip')

    // await getNotifications('BookingTrip')
})
</script>
<template>
    <a-row>
        <a-col :span="24">
            <h3>Отправлять заказ тура</h3>
        </a-col>
        <a-col :span="24" class="d-flex align-center">
            <a-input v-model:value="cabinetNotifications.bookingTrip" placeholder="email" />
            <a-button type="primary" class="ml-12 lets_go_btn"
                @click="addCabinetNotifications('BookingTrip', cabinetNotifications.bookingTrip)">добавить</a-button>
        </a-col>
        <a-col v-if="createTripEmails.length != 0" v-for="email of bookingTripNotifications" class="ma-4"
            style="cursor: pointer; font-size: 12px;">
            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                @confirm="deleteNotfications('BookingTrip', email)">
                {{ email }}
            </a-popconfirm>
        </a-col>
        <a-col v-else>
            пусто
        </a-col>
    </a-row>
    <a-row class="mt-16">
        <a-col :span="24">
            <h3>Email-уведомления</h3>
        </a-col>
    </a-row>
    <a-row :gutter="[16, 0]">
        <a-col :span="24">
            Создание тура
        </a-col>
        <a-col :span="24" class="d-flex align-center">
            <a-input v-model:value="emailCreateTrip" placeholder="email" />
            <a-button type="primary" class="ml-12 lets_go_btn"
                @click="addEmail('CreateTrip', emailCreateTrip)">добавить</a-button>

        </a-col>
        <a-col v-if="createTripEmails.length != 0" v-for="email of createTripEmails" class="ma-4"
            style="cursor: pointer; font-size: 12px;">
            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="deleteEmail('CreateTrip', email)">
                {{ email }}
            </a-popconfirm>
        </a-col>
        <a-col v-else>
            пусто
        </a-col>
    </a-row>
    <a-row :gutter="[16, 0]" class="mt-16">
        <a-col :span="24">
            Заказ тура
        </a-col>
        <a-col :span="24" class="d-flex align-center">
            <a-input v-model:value="emailBookingTrip" placeholder="email" />
            <a-button type="primary" class="ml-12 lets_go_btn"
                @click="addEmail('BookingTrip', emailBookingTrip)">добавить</a-button>
        </a-col>
        <a-col v-if="bookingTripEmails.length != 0" v-for="email of bookingTripEmails" class="ma-4"
            style="cursor: pointer; font-size: 12px;">
            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="deleteEmail('BookingTrip', email)">
                {{ email }}
            </a-popconfirm>
        </a-col>
        <a-col v-else>
            пусто
        </a-col>
    </a-row>
    <a-row :gutter="[16, 0]" class="mt-16">
        <a-col :span="24">
            Создание попутчика
        </a-col>
        <a-col :span="24" class="d-flex align-center">
            <a-input v-model:value="emailCreateCompanion" placeholder="email" />
            <a-button type="primary" class="ml-12 lets_go_btn"
                @click="addEmail('CreateCompanion', emailCreateCompanion)">добавить</a-button>
        </a-col>
        <a-col v-if="createCompanionEmails.length != 0" v-for="email of createCompanionEmails" class="ma-4"
            style="cursor: pointer; font-size: 12px;">
            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                @confirm="deleteEmail('CreateCompanion', email)">
                {{ email }}
            </a-popconfirm>
        </a-col>
        <a-col v-else>
            пусто
        </a-col>
    </a-row>
    <a-row :gutter="[16, 0]" class="mt-16">
        <a-col :span="24">
            Создание экскурсии
        </a-col>
        <a-col :span="24" class="d-flex align-center">
            <a-input v-model:value="emailCreateExcurtion" placeholder="email" />
            <a-button type="primary" class="ml-12 lets_go_btn"
                @click="addEmail('CreateExcurtion', emailCreateExcurtion)">добавить</a-button>
        </a-col>
        <a-col v-if="createExcurtionEmails.length != 0" v-for="email of createExcurtionEmails" class="ma-4"
            style="cursor: pointer; font-size: 12px;">
            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                @confirm="deleteEmail('CreateExcurtion', email)">
                {{ email }}
            </a-popconfirm>
        </a-col>
        <a-col v-else>
            пусто
        </a-col>
    </a-row>
    <a-row :gutter="[16, 0]" class="mt-16">
        <a-col :span="24">
            Покупка тура
        </a-col>
        <a-col :span="24" class="d-flex align-center">
            <a-input v-model:value="emailBuyTrip" placeholder="email" />
            <a-button type="primary" class="ml-12 lets_go_btn"
                @click="addEmail('BuyTrip', emailBuyTrip)">добавить</a-button>
        </a-col>
        <a-col v-if="buyTripEmails.length != 0" v-for="email of buyTripEmails" class="ma-4"
            style="cursor: pointer; font-size: 12px;">
            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="deleteEmail('BuyTrip', email)">
                {{ email }}
            </a-popconfirm>
        </a-col>
        <a-col v-else>
            пусто
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="24">
            <h3>Изменить права доступа</h3>
        </a-col>
    </a-row>
    <a-row :gutter="[16, 16]">
        <a-col :span="24" :md="12" :xl="18">
            <a-input v-model:value="query" placeholder="Имя или email" />
        </a-col>
        <a-col :span="24" :md="12" :xl="6">
            <a-select v-model:value="userRole" style="width: 100%">
                <a-select-option
                    v-for="role in [{ value: 'user', name: 'Все' }, { value: 'manager', name: 'Менеджер' }, { value: 'admin', name: 'Админ' }]"
                    :value="role.value">{{ role.name }}</a-select-option>
            </a-select>
        </a-col>
    </a-row>
    <a-row class="mt-16 mb-16" :gutter="[16, 16]" style="max-height: 300px; overflow-y: scroll;">
        <a-col v-for="userFromDb of users" :span="24" :md="12">
            <UserCard :userFromDb="userFromDb" />
        </a-col>
    </a-row>
</template>