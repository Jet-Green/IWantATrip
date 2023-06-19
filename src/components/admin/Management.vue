<script setup>
import { ref, watch } from 'vue'
import { useAdmin } from '../../stores/admin'
import UserCard from "./UserCard.vue"


let adminStore = useAdmin()

let query = ref('')
let userRole = ref('user')

function find() {
    console.log(query.value);
}
watch([query, userRole], async ([newQuery, newUserRole]) => {
    let queryToDb = {}

    queryToDb.role = newUserRole

    newQuery = newQuery.trim()
    if (newQuery.length > 2) {
        queryToDb.query = newQuery
    } else {
        queryToDb.query = ''
    }

    let res = await adminStore.fetchUsers(queryToDb)
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
                    v-for="role in [{ value: 'user', name: 'Любой' }, { value: 'manager', name: 'Менеджер' }, { value: 'admin', name: 'Админ' }]"
                    :value="role.value">{{ role.name }}</a-select-option>
            </a-select>
        </a-col>
    </a-row>
    <a-row class="mt-16" :gutter="[16, 16]">
        <a-col v-for="user of adminStore.users" :span="24" :md="12">
            <UserCard :user="user" />
        </a-col>
    </a-row>
</template>