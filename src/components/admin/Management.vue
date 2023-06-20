<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAdmin } from '../../stores/admin'
import UserCard from "./UserCard.vue"


let adminStore = useAdmin()

let query = ref('')
let userRole = ref('user')

let users = ref([])

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
})
</script>
<template>
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
    <a-row class="mt-16" :gutter="[16, 16]">
        <a-col v-for="userFromDb of users" :span="24" :md="12">
            <UserCard :userFromDb="userFromDb" />
        </a-col>
    </a-row>
</template>