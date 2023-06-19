<script setup>
import { ref, watch } from 'vue'
import { useAdmin } from '../../stores/admin'


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
        <a-col :span="12">
            <a-input v-model:value="query" placeholder="Имя или email" />
        </a-col>
        <a-col :span="12">
            <a-select v-model:value="userRole" style="width: 100%">
                <a-select-option
                    v-for="role in [{ value: 'user', name: 'Обычный пользователь' }, { value: 'manager', name: 'Менеджер' }, { value: 'admin', name: 'Админ' }]"
                    :value="role.value">{{ role.name }}</a-select-option>
            </a-select>
        </a-col>
    </a-row>
    <a-row>
        {{ adminStore.users }}
    </a-row>
</template>